import type { MetaFunction } from "@remix-run/node";
import HeaderBox from "~/components/HeaderBox";
import TotalBalanceBox from "~/components/TotalBalanceBox";
import RightSidebar from "~/components/RightSidebar";

export const meta: MetaFunction = () => {
    return [
        { title: "New Remix App" },
        { name: "description", content: "Welcome to Remix!" },
    ];
};

export default function Index() {
    return (
        <section className="home">
            <div className="home-content">
                <header className="home-header">
                    <HeaderBox subtext="Access and manage your account and transactions efficiently.">
                        Welcome<span className="text-bankGradient">&nbsp;Alex</span>
                    </HeaderBox>

                    <TotalBalanceBox
                        accounts={[]}
                        totalBanks={1}
                        totalCurrentBalance={1253.55}
                    />
                </header>
            </div>

            <RightSidebar />
        </section>
    );
}
