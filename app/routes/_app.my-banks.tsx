import { Suspense } from "react";
import { useLoaderData, Await } from "@remix-run/react";
import { redirect, defer } from "@remix-run/node";
import { getLoggedInUserInfo } from "~/services/db/users.server";
import { getAccounts } from "~/services/plaid.server";
import HeaderBox from "~/components/HeaderBox";
import BankCard from "~/components/BankCard";
import RightSidebarBankListSkeleton from "~/components/skeleton/RightSidebarBankListSkeleton";
import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";

export const meta: MetaFunction = () => {
    return [
        { title: "My Bank Accounts" },
        { name: "description", content: "Effortlessly manage your banking activites." },
    ];
};

export const loader = async ({
    request
}: LoaderFunctionArgs) => {
    const userInfo = await getLoggedInUserInfo(request);

    if (!userInfo) {
        return redirect("/signin");
    }

    const accountsData = getAccounts({ userId: userInfo.$id });

    return defer({
        userInfo: userInfo,
        accountsData,
    });
}

export default function MyBanks() {
    const {
        accountsData,
        userInfo,
    } = useLoaderData<typeof loader>();

    return (
        <section className='flex'>
            <div className="my-banks">
                <HeaderBox subtext="Effortlessly manage your banking activites.">
                    My Bank Accounts
                </HeaderBox>

                <div className="space-y-4">
                    <h2 className="header-2">
                        Your cards
                    </h2>
                    <div className="flex flex-wrap gap-6">
                        <Suspense fallback={<RightSidebarBankListSkeleton />}>
                            <Await resolve={accountsData}>
                                {
                                    (accountsData) => accountsData.accounts.map((account: Account)  => (
                                        <BankCard
                                            key={account.id}
                                            account={account}
                                            userName={userInfo.firstName}
                                        />
                                    ))  
                                }
                            </Await>
                        </Suspense>
                    </div>
                </div>
            </div>
        </section>
    )
}