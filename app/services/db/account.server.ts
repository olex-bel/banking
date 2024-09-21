import { createSessionClient } from "../appwrite.server";
import { authenticator } from "~/services/authenticator.server";



export async function getAccount(request: Request) {
    const userSession = await authenticator.isAuthenticated(request, {
        failureRedirect: "/signin",
    });

    const { account } = await createSessionClient(userSession);

    return await account.get();
}
