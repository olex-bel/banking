import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { createAdminClient } from "./appwrite.server";
import { sessionStorage } from "./session.server";
import { ID } from "node-appwrite";
import type { UserSession } from "./appwrite.server";

export const EMAIL_PASSWORD_STRATEGY = "email-password-strategy";
export const authenticator = new Authenticator<UserSession>(sessionStorage);

authenticator.use(
    new FormStrategy(async ({ context }) => {
        if (!context?.formData) {
            throw new Error("FormData must be provided in the Context");
        }

        const formData = context.formData as FormData;

        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const { account } = await createAdminClient();
        const session = await account.createEmailPasswordSession(email, password);

        return { secret: session.secret };
    }),
    EMAIL_PASSWORD_STRATEGY
);

export async function signUpWithEmail(request: Request): Promise<UserSession | null> {
    const formData = await request.formData();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;

    const { account } = await createAdminClient();
    await account.create(ID.unique(), email, password, `${firstName} ${lastName}`);

    const session = await account.createEmailPasswordSession(email, password);

    if (!session) {
        return null;
    }

    return { secret: session.secret };
}
