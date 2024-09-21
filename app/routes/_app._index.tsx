import { Suspense } from "react";
import { redirect, defer } from "@remix-run/node";
import { useLoaderData, Await } from "@remix-run/react";
import HeaderBox from "~/components/HeaderBox";
import TotalBalanceBox from "~/components/TotalBalanceBox";
import RightSidebarBankList from "~/components/RightSidebarBankList";
import RightSidebarUserInfo from "~/components/RightSidebarUserInfo";
import RightSidebarBanks from "~/components/RightSidebarBanks";
import TotalBalanceBoxSkeleton from "~/components/skeleton/TotalBalanceBoxSkeleton";
import RightSidebarBankListSkeleton from "~/components/skeleton/RightSidebarBankListSkeleton";
import Accounts from "~/components/Accounts";
import { getLoggedInUserInfo } from "~/services/db/users.server";
import { getAccounts } from "~/services/plaid.server";
import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";

export const meta: MetaFunction = () => {
    return [
        { title: "Banking" },
        { name: "description", content: "Manage your bank accounts." },
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
};

export default function Index() {
    const {
        accountsData,
        userInfo,
    } = useLoaderData<typeof loader>();

    return (
        <section className="home">
            <div className="home-content">
                <header className="home-header">
                    <HeaderBox subtext="Access and manage your account and transactions efficiently.">
                        Welcome<span className="text-bankGradient">&nbsp;{userInfo.firstName}</span>
                    </HeaderBox>

                    <Suspense fallback={<TotalBalanceBoxSkeleton />}>
                        <Await resolve={accountsData}>
                            {
                                (accountsData) =>
                                    <TotalBalanceBox
                                        accounts={accountsData?.accounts}
                                        totalBanks={accountsData?.totalBanks}
                                        totalCurrentBalance={accountsData?.totalCurrentBalance}
                                    />
                            }
                        </Await>
                    </Suspense>
                </header>

                <Suspense fallback={<div>Loading...</div>}>
                    <Await resolve={accountsData}>
                        {
                            ({ accounts }) => {
                                const appwriteItemId = accounts[0].appwriteItemId;
                                return <Accounts
                                    accounts={accounts}
                                    appwriteItemId={appwriteItemId}
                                />
                            }
                        }
                    </Await>
                </Suspense>
            </div>

            <aside className="right-sidebar">
                <RightSidebarUserInfo user={userInfo} />
                <RightSidebarBanks>
                    <Suspense fallback={<RightSidebarBankListSkeleton />}>
                        <Await resolve={accountsData}>
                            {
                                (accountsData) =>
                                    <RightSidebarBankList
                                        user={userInfo}
                                        banks={accountsData?.accounts.slice(0, 2)}
                                    />
                            }
                        </Await>
                    </Suspense>
                </RightSidebarBanks>
            </aside>
        </section>
    );
}
