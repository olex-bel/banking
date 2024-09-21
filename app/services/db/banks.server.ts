
import { ID, Query, Models } from "node-appwrite";
import { createAdminClient, DATABASE_ID, BANK_COLLECTION_ID } from "../appwrite.server";

type BankDocument = Models.Document & Bank;

export const createBankAccount = async ({
    userId,
    bankId,
    accountId,
    accessToken,
    fundingSourceUrl,
    shareableId,
}: createBankAccountProps) => {

    const { database } = await createAdminClient();

    const bankAccount = await database.createDocument(
        DATABASE_ID!,
        BANK_COLLECTION_ID!,
        ID.unique(),
        {
            userId,
            bankId,
            accountId,
            accessToken,
            fundingSourceUrl,
            shareableId,
        }
    );

    return bankAccount;
}

export const getBanks = async ({ userId }: getBanksProps) => {
    const { database } = await createAdminClient();

    const banks = await database.listDocuments(
        DATABASE_ID!,
        BANK_COLLECTION_ID!,
        [Query.equal('userId', [userId])]
    )

    return banks.documents as BankDocument[];
}

export const getBank = async ({ documentId }: getBankProps) => {
    const { database } = await createAdminClient();

    const bank = await database.listDocuments(
        DATABASE_ID!,
        BANK_COLLECTION_ID!,
        [Query.equal('$id', [documentId])]
    )

    return bank.documents[0] as BankDocument;
}

export const getBankByAccountId = async ({ accountId }: getBankByAccountIdProps) => {
    const { database } = await createAdminClient();

    const bank = await database.listDocuments(
        DATABASE_ID!,
        BANK_COLLECTION_ID!,
        [Query.equal('accountId', [accountId])]
    )

    if (bank.total !== 1) {
        return null;
    }

    return bank.documents[0];
}
