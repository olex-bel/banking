
import { ID, Query } from "node-appwrite";
import { createAdminClient, DATABASE_ID, TRANSACTION_COLLECTION_ID } from "../appwrite.server";
import type { Models } from "node-appwrite";

export type TransactionDocument = Models.Document & Transaction;

export const createTransaction = async (transaction: CreateTransactionProps) => {

    const { database } = await createAdminClient();

    const newTransaction = await database.createDocument(
        DATABASE_ID!,
        TRANSACTION_COLLECTION_ID!,
        ID.unique(),
        {
            channel: 'online',
            category: 'Transfer',
            ...transaction
        }
    )

    return newTransaction;

}

export const getTransactionsByBankId = async ({ bankId }: getTransactionsByBankIdProps) => {
    const { database } = await createAdminClient();

    const senderTransactions = await database.listDocuments(
        DATABASE_ID!,
        TRANSACTION_COLLECTION_ID!,
        [Query.equal('senderBankId', bankId)],
    )

    const receiverTransactions = await database.listDocuments(
        DATABASE_ID!,
        TRANSACTION_COLLECTION_ID!,
        [Query.equal('receiverBankId', bankId)],
    );

    const transactions = {
        total: senderTransactions.total + receiverTransactions.total,
        documents: [
            ...senderTransactions.documents,
            ...receiverTransactions.documents,
        ]
    }

    return transactions;
}
