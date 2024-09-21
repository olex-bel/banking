

import { Configuration, PlaidApi, PlaidEnvironments, CountryCode, ProcessorTokenCreateRequest, ProcessorTokenCreateRequestProcessorEnum, Products } from "plaid";
import { addFundingSource } from "./dwolla.server";
import { createBankAccount, getBanks, getBank } from "./db/banks.server";
import { getTransactionsByBankId } from "./db/transaction.server";
import { encryptId } from "~/libs/utils";
import type { TransactionPaymentChannelEnum } from "plaid";
import type { TransactionDocument } from "./db/transaction.server";

type PlaidTransaction = {
    id: string;
    name: string;
    paymentChannel: TransactionPaymentChannelEnum;
    type: TransactionPaymentChannelEnum;
    accountId: string;
    amount: number;
    pending: boolean;
    category: string;
    date: string;
    image?: string | null;
};

const configuration = new Configuration({
    basePath: PlaidEnvironments.sandbox,
    baseOptions: {
        headers: {
            'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
            'PLAID-SECRET': process.env.PLAID_SECRET,
        }
    }
})

const plaidClient = new PlaidApi(configuration);

export const createLinkToken = async (user: User) => {

    const tokenParams = {
        user: {
            client_user_id: user.$id
        },
        client_name: `${user.firstName} ${user.lastName}`,
        products: ['auth'] as Products[],
        language: 'en',
        country_codes: ['US'] as CountryCode[],
    }

    const response = await plaidClient.linkTokenCreate(tokenParams);

    return response.data.link_token;
}

export const exchangePublicToken = async ({
    publicToken,
    user,
}: exchangePublicTokenProps) => {
    const response = await plaidClient.itemPublicTokenExchange({
        public_token: publicToken,
    });

    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;

    // Get account information from Plaid using the access token
    const accountsResponse = await plaidClient.accountsGet({
        access_token: accessToken,
    });

    const accountData = accountsResponse.data.accounts[0];

    // Create a processor token for Dwolla using the access token and account ID
    const request: ProcessorTokenCreateRequest = {
        access_token: accessToken,
        account_id: accountData.account_id,
        processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum,
    };

    const processorTokenResponse = await plaidClient.processorTokenCreate(request);
    const processorToken = processorTokenResponse.data.processor_token;

    // Create a funding source URL for the account using the Dwolla customer ID, processor token, and bank name
    const fundingSourceUrl = await addFundingSource({
        dwollaCustomerId: user.dwollaCustomerId,
        processorToken,
        bankName: accountData.name,
    });

    // If the funding source URL is not created, throw an error
    if (!fundingSourceUrl) throw Error;

    // Create a bank account using the user ID, item ID, account ID, access token, funding source URL, and shareableId ID
    await createBankAccount({
        userId: user.$id,
        bankId: itemId,
        accountId: accountData.account_id,
        accessToken,
        fundingSourceUrl,
        shareableId: encryptId(accountData.account_id),
    });

    // Return a success message
    return {
        publicTokenExchange: "complete",
    };
}

export const getAccounts = async ({ userId }: getAccountsProps) => {

    // get banks from db
    const banks = await getBanks({ userId });

    const accounts = await Promise.all(
        banks?.map(async (bank: Bank) => {
            // get each account info from plaid
            const accountsResponse = await plaidClient.accountsGet({
                access_token: bank.accessToken,
            });
            const accountData = accountsResponse.data.accounts[0];

            // get institution info from plaid
            const institution = await getInstitution({
                institutionId: accountsResponse.data.item.institution_id!,
            });

            const account = {
                id: accountData.account_id,
                availableBalance: accountData.balances.available!,
                currentBalance: accountData.balances.current!,
                institutionId: institution.institution_id,
                name: accountData.name,
                officialName: accountData.official_name || "",
                mask: accountData.mask!,
                type: accountData.type as string,
                subtype: accountData.subtype! as string,
                appwriteItemId: bank.$id,
                shareableId: bank.shareableId,
            };

            return account;
        })
    );

    const totalBanks = accounts.length;
    const totalCurrentBalance = accounts.reduce((total, account) => {
        return total + account.currentBalance;
    }, 0);

    return { accounts, totalBanks, totalCurrentBalance };
};

export const getInstitution = async ({
    institutionId,
}: getInstitutionProps) => {
    const institutionResponse = await plaidClient.institutionsGetById({
        institution_id: institutionId,
        country_codes: ["US"] as CountryCode[],
    });

    const intitution = institutionResponse.data.institution;

    return intitution;
};

export const getAccount = async ({ userId, appwriteItemId, transactionsItemLimit }: getAccountProps) => {
    let bank;

    // get bank from db
    if (appwriteItemId) {
        bank = await getBank({ documentId: appwriteItemId });
    } else {
        const banks = await getBanks({ userId });
        bank = banks[0];
    }

    // get account info from plaid
    const accountsResponse = await plaidClient.accountsGet({
        access_token: bank.accessToken,
    });
    const accountData = accountsResponse.data.accounts[0];

    // get transfer transactions from appwrite
    const transferTransactionsData = await getTransactionsByBankId({
        bankId: bank.$id,
    });

    const transferTransactions = transferTransactionsData.documents.map(
        (document) => {
            const transferData = document as TransactionDocument;

            return {
                id: transferData.$id,
                name: transferData.name!,
                amount: transferData.amount!,
                date: transferData.$createdAt,
                paymentChannel: transferData.channel,
                category: transferData.category,
                type: transferData.senderBankId === bank.$id ? "debit" : "credit",
            }
        }
    );

    // get institution info from plaid
    const institution = await getInstitution({
        institutionId: accountsResponse.data.item.institution_id!,
    });

    const transactions = await getTransactions({
        accessToken: bank?.accessToken,
        limit: transactionsItemLimit,
    });

    const account = {
        id: accountData.account_id,
        availableBalance: accountData.balances.available!,
        currentBalance: accountData.balances.current!,
        institutionId: institution.institution_id,
        name: accountData.name,
        officialName: accountData.official_name,
        mask: accountData.mask!,
        type: accountData.type as string,
        subtype: accountData.subtype! as string,
        appwriteItemId: bank.$id,
    };

    // sort transactions by date such that the most recent transaction is first
    const allTransactions = [...transactions, ...transferTransactions].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return {
        data: account,
        transactions: allTransactions,
    };
};

export const getTransactions = async ({
    accessToken,
    limit,
}: getTransactionsProps) => {
    let hasMore = true;
    let transactions: PlaidTransaction[] = [];

    while (hasMore) {
        const response = await plaidClient.transactionsSync({
            access_token: accessToken,
            count: limit,
        });

        const data = response.data;

        transactions = response.data.added.map((transaction) => ({
            id: transaction.transaction_id,
            name: transaction.name,
            paymentChannel: transaction.payment_channel,
            type: transaction.payment_channel,
            accountId: transaction.account_id,
            amount: transaction.amount,
            pending: transaction.pending,
            category: transaction.category ? transaction.category[0] : "",
            date: transaction.date,
            image: transaction.logo_url,
        }));

        if (limit && transactions.length >= limit) {
            break;
        }

        hasMore = data.has_more;
    }

    return transactions;
};
