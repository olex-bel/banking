
import { Client, Account, Databases, Users } from "node-appwrite";

export interface UserSession {
    secret: string;
}

export const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;
export const USER_COLLECTION_ID = process.env.APPWRITE_USERS_COLLECTION_ID;
export const BANK_COLLECTION_ID = process.env.APPWRITE_BANKS_COLLECTION_ID;
export const TRANSACTION_COLLECTION_ID = process.env.APPWRITE_TRANSACTIONS_COLLECTION_ID;

export async function createSessionClient(session: UserSession) {
    if (!process.env.APPWRITE_PUBLIC_ENDPOINT || !process.env.APPWRITE_PUBLIC_PROJECT) {
        throw new Error("Missing required environment variables.");
    }
    
    const client = new Client()
      .setEndpoint(process.env.APPWRITE_PUBLIC_ENDPOINT)
      .setProject(process.env.APPWRITE_PUBLIC_PROJECT);
  
    if (!session || !session.secret) {
        throw new Error("No session");
    }
  
    client.setSession(session.secret);
  
    return {
        get account() {
            return new Account(client);
        },
    };
}
  
export async function createAdminClient() {
    if (!process.env.APPWRITE_PUBLIC_ENDPOINT || !process.env.APPWRITE_PUBLIC_PROJECT || !process.env.APPWRITE_SECRET) {
        throw new Error("Missing required environment variables.");
    }

    const client = new Client()
      .setEndpoint(process.env.APPWRITE_PUBLIC_ENDPOINT)
      .setProject(process.env.APPWRITE_PUBLIC_PROJECT)
      .setKey(process.env.APPWRITE_SECRET);
  
    return {
        get account() {
            return new Account(client);
        },
        get database() {
            return new Databases(client);
        },
        get user() {
            return new Users(client);
        }
    };
}
