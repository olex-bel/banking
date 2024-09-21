import { json, redirect } from "@remix-run/node";
import { useLoaderData, useActionData } from "@remix-run/react";
import { zx } from "zodix";
import { z } from "zod";
import HeaderBox from "~/components/HeaderBox";
import PaymentTransferForm from "~/components/PaymentTransferForm";
import { getLoggedInUserInfo } from "~/services/db/users.server";
import { getAccounts } from "~/services/plaid.server";
import { getBank, getBankByAccountId } from "~/services/db/banks.server";
import { createTransfer } from "~/services/dwolla.server";
import { createTransaction } from "~/services/db/transaction.server";
import { zodErrors, decryptId } from "~/libs/utils";
import type { LoaderFunctionArgs, MetaFunction, ActionFunctionArgs } from "@remix-run/node";

export const meta: MetaFunction = () => {
    return [
        { title: "Payment Transfer" },
        { name: "description", content: "Effortlessly manage your banking activites." },
    ];
};

export async function action({ request }: ActionFunctionArgs) {
    const userInfo = await getLoggedInUserInfo(request);

    if (!userInfo) {
        return redirect("/signin");
    }

    const result = await zx.parseFormSafe(request, {
        email: z.string().email("Invalid email address"),
        note: z.string().min(4, "Transfer note is too short"),
        amount: z.string().min(4, "Amount is too short"),
        senderBankId: z.string().min(4, "Please select a valid bank account"),
        sharableId: z.string().min(8, "Please select a valid sharable Id"),
    });

    if (result.error) {
        return json({
            errors: zodErrors(result.error),
        });
    }

    try {
        const receiverAccountId = decryptId(result.data.sharableId);
        const receiverBank = await getBankByAccountId({
            accountId: receiverAccountId,
        });

        if (!receiverBank) {
            throw new Error("Account not found.");
        }

        const senderBank = await getBank({ documentId: result.data.senderBankId });
        const transferParams = {
            sourceFundingSourceUrl: senderBank.fundingSourceUrl,
            destinationFundingSourceUrl: receiverBank.fundingSourceUrl,
            amount: result.data.amount,
        };

        const transfer = await createTransfer(transferParams);

        if (transfer) {
            const transaction = {
                name: result.data.note,
                amount: result.data.amount,
                senderId: senderBank.userId.$id,
                senderBankId: senderBank.$id,
                receiverId: receiverBank.userId.$id,
                receiverBankId: receiverBank.$id,
                email: result.data.email,
            };

            const newTransaction = await createTransaction(transaction);

            if (!newTransaction) {
                throw new Error("Transaction cannot be created.");
            }

            return redirect("/");
        }

    } catch (error) {
        console.error('Cannon exchange public token:', error);
        return {
            errorMessage: "An unexpected error occurred. Please try again later.",
        };
    }
}

export const loader = async ({
    request
}: LoaderFunctionArgs) => {
    const userInfo = await getLoggedInUserInfo(request);

    if (!userInfo) {
        return redirect("/signin");
    }

    const accountsData = await getAccounts({ userId: userInfo.$id });

    return json({
        userInfo: userInfo,
        accountsData,
    });
}

export default function PaymentTransfer() {
    const { accountsData } = useLoaderData<typeof loader>();
    const actionData = useActionData<typeof action>();
    const errorMessage = actionData && "errorMessage" in actionData? actionData.errorMessage : undefined;
    const errors = actionData && "errors" in actionData? actionData.errors : undefined;

    return (
        <section className="payment-transfer">
            <HeaderBox subtext="Please provide any specific details or notes related to the payment transfer">
                Payment Transfer
            </HeaderBox>

            <section className="size-full pt-5">
                <PaymentTransferForm accounts={accountsData.accounts} errorMessage={errorMessage} errors={errors} />
            </section>
        </section>
    );
}
