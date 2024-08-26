
import { ID } from "node-appwrite";
import { createAdminClient } from "./appwrite.server";

type UserData = {
    firstName: string;
    lastName: string;
    address1: string;
    city: string;
    state: string;
    postalCode: string;
    dateOfBirth: string;
    ssn: string;
    email: string;
    password: string;
};

if (!process.env.APPWRITE_DATABASE_ID || !process.env.APPWRITE_USERS_COLLECTION_ID || !process.env.APPWRITE_BANKS_COLLECTION_ID) {
    throw new Error("Missing required collection environment variables.");
}

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;
const USER_COLLECTION_ID = process.env.APPWRITE_USERS_COLLECTION_ID;
const BANK_COLLECTION_ID = process.env.APPWRITE_BANKS_COLLECTION_ID;

export async function signUp({password, ...userData}: UserData) {
    const { email, firstName, lastName } = userData;
    const { account, database } = await createAdminClient();

    const newAccount = await account.create(ID.unique(), email, password, `${firstName} ${lastName}`);

    if (!newAccount) {
        throw new Error("Error creating account.");
    }

    const newUser = await database.createDocument(
        DATABASE_ID,
        USER_COLLECTION_ID,
        ID.unique(),
        {
          ...userData,
          userId: newAccount.$id,
          dwollaCustomerId,
          dwollaCustomerUrl
        }
    )

    const session = await account.createEmailPasswordSession(email, password);

    return session;
}
