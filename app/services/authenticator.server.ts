import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { createAdminClient } from "./appwrite.server";
import { sessionStorage } from "./session.server";
import { AppwriteException } from "node-appwrite";
import type { UserSession } from "./appwrite.server";

export const EMAIL_PASSWORD_STRATEGY = "email-password-strategy";
export const authenticator = new Authenticator<UserSession>(sessionStorage);

authenticator.use(
    new FormStrategy(async ({ form }) => {
        if (!form) {
            throw new Error("FormData must be provided in the Context");
        }

        const formData = form;

        try {
            const email = formData.get("email") as string;
            const password = formData.get("password") as string;
            const { account } = await createAdminClient();
            const session = await account.createEmailPasswordSession(email, password);
            return { secret: session.secret };
        } catch (error) {
            let errorMessage = "An error occurred. Please try again later.";

            console.error("Cannot sign in:", error);

            if (error instanceof AppwriteException) {
                switch (error.type) {
                    case "user_blocked":
                        errorMessage = "Your account has been blocked. Please contact support.";
                        break;
                    case "user_invalid_credentials":
                        errorMessage = "Invalid credentials. Please check your email and password.";
                        break;
                }
            }

            throw Error(errorMessage);
        }
    }),
    EMAIL_PASSWORD_STRATEGY
);
