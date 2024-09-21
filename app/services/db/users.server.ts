
import { ID, Query, AppwriteException, Models } from "node-appwrite";
import { createSessionClient, createAdminClient, DATABASE_ID, USER_COLLECTION_ID } from "../appwrite.server";
import { authenticator } from "~/services/authenticator.server";
import { extractCustomerIdFromUrl } from "~/libs/utils";
import { createDwollaCustomer } from "../dwolla.server";

type UserDocument = Models.Document & User;

export async function getLoggedInAccount(request: Request) {
    const userSession = await authenticator.isAuthenticated(request);

    if (!userSession) {
        return null;
    }

    const { account } = await createSessionClient(userSession);

    return await account.get();
}

export async function getUserById(userId: string) {
    const { database } = await createAdminClient();

    const result = await database.listDocuments<UserDocument>(
        DATABASE_ID!,
        USER_COLLECTION_ID!,
        [Query.equal('userId', [userId])]
    );

    if (result.documents.length > 0) {
        return result.documents[0];
    }

    return null;
}

export async function getLoggedInUserInfo(request: Request) {
      const account = await getLoggedInAccount(request);

      if (!account) {
        return null;
      }

      const user = await getUserById(account.$id);

      return user;
}

export async function signUp({password, ...userData}: SignUpParams) {
    const { email, firstName, lastName } = userData;
    const { account, database } = await createAdminClient();

    const newAccount = await account.create(ID.unique(), email, password, `${firstName} ${lastName}`);

    if (!newAccount) {
        throw new Error("Error creating account.");
    }

    const dwollaCustomerUrl = await createDwollaCustomer({
        ...userData,
        type: 'personal'
    });

    if (!dwollaCustomerUrl) {
        throw new Error('Error creating Dwolla customer');
    }

    const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl);

    await database.createDocument(
        DATABASE_ID!,
        USER_COLLECTION_ID!,
        ID.unique(),
        {
          ...userData,
          userId: newAccount.$id,
          dwollaCustomerId,
          dwollaCustomerUrl
        }
    );

    const session = await account.createEmailPasswordSession(email, password);

    return session;
}

export function handleSignUpError(error: unknown) {
    // console.error("Cannot create a new account:", error);
    
    let errorMessage = "An error occurred. Please try again later.";

    if (error instanceof AppwriteException) {
        switch (error.type) {
            case "user_email_not_whitelisted":
                errorMessage = "Your email is not whitelisted. Please contact support to request access.";
                break;
            case "user_already_exists":
            case "user_email_already_exists":
            case "user_phone_already_exists":
                errorMessage = "This user is already registered. Try logging in instead.";
                break;
            default:
                errorMessage = "Registration failed due to an unknown error. Please try again or contact support.";
        }
    }

    return {
        saccess: false,
        errorMessage,
    };
}
