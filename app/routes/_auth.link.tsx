
import { json, redirect } from "@remix-run/node";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { getLoggedInUserInfo } from "~/services/db/users.server";
import { createLinkToken, exchangePublicToken } from "~/services/plaid.server";
import { usePlaidLink, PlaidLinkOptions } from "react-plaid-link";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";

export const loader = async ({
    request
}: LoaderFunctionArgs) => {
    const userInfo = await getLoggedInUserInfo(request);

    if (!userInfo) {
        return redirect("/signin");
    }

    try {
        const token = await createLinkToken(userInfo);

        return json({
            token,
            errorMessage: null,
        });
    } catch (error) {
        console.error('Cannot create link token:', error);
        return json({
            token: "",
            errorMessage: "An unexpected error occurred. Please try again later.",
        });
    }
};


export async function action({ request }: ActionFunctionArgs) {
    const userInfo = await getLoggedInUserInfo(request);

    if (!userInfo) {
        return redirect("/signin");
    }

    const formData = await request.formData();
    const publicToken = formData.get("publicToken") as string;

    try {
        await exchangePublicToken({
            publicToken,
            user: userInfo,
        });
    } catch (error) {
        console.error('Cannon exchange public token:', error);
        return {
            errorMessage: "An unexpected error occurred. Please try again later.",
        };
    }

    return redirect("/");
}

export default function LinkAccount() {
    const data = useLoaderData<typeof loader>();
    const fecher = useFetcher();

    const onSuccess = async (public_token: string) => {
        const formData = new FormData();

        formData.set("publicToken", public_token);
        fecher.submit(formData, {
            method: "POST",
        });
    };

    const config: PlaidLinkOptions = {
        token: data.token,
        onSuccess
    }

    const { open, ready } = usePlaidLink(config);

    return (
        <section className="flex-center size-full max-sm:px-6">
            <section className="auth-form">
                <header className='flex flex-col gap-5 md:gap-8'>
                    <Link to="/" className="cursor-pointer flex items-center gap-1">
                        <img 
                            src="/icons/logo.svg"
                            width={34}
                            height={34}
                            alt="Horizon logo"
                        />
                        <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">Horizon</h1>
                    </Link>

                    <div className="flex flex-col gap-1 md:gap-3">
                        <h1 className="text-24 lg:text-36 font-semibold text-gray-900">Link Account</h1>
                    </div>
                </header>

                {(data.errorMessage)?
                    (<em className="text-red-600">{data.errorMessage}</em>)
                    :
                    <button
                        onClick={() => open()}
                        disabled={!ready}
                        className="form-btn plaidlink-primary"
                    >
                        Connect bank
                    </button>
                }
            </section>
        </section>
    );
}
