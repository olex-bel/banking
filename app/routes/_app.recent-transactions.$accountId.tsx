
import { redirect, json } from "@remix-run/node";
import invariant from "tiny-invariant";
import { getLoggedInUserInfo } from "~/services/db/users.server";
import { getAccount } from "~/services/plaid.server";
import type { LoaderFunctionArgs } from "@remix-run/node";

export const loader = async ({
    request,
    params
}: LoaderFunctionArgs) => {
    invariant(params.accountId, "Missing account Id param");
    const userInfo = await getLoggedInUserInfo(request);

    if (!userInfo) {
        return redirect("/signin");
    }

    try {
        const account = await getAccount({ appwriteItemId: params.accountId, userId: userInfo.$id, transactionsItemLimit: 10 })

        return json({
            transactions: account.transactions,
        });
    } catch (e) {
        console.log(e);
    }

    return json({
        transactions: [],
    });
};

