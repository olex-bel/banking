
import { Link } from "@remix-run/react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import BankTabItem from "./BankTabItem";
import BankInfo from "./BankInfo";
import RecentTransactions from "./RecentTransactions";

export default function Accounts({
    accounts,
    appwriteItemId,
}: AccountsProps) {    
    return (
        <section className="recent-transactions">
            <header className="flex items-center justify-between">
                <h2 className="recent-transactions-label">Recent transactions</h2>
                <Link
                    to={`/transaction-history/${appwriteItemId}`}
                    className="view-all-btn"
                >
                    View all
                </Link>
            </header>

            <Tabs defaultValue={appwriteItemId} className="w-full">
                <TabsList className="recent-transactions-tablist">
                    {accounts.map((account: Account) => (
                        <TabsTrigger key={account.id} value={account.appwriteItemId}>
                            <BankTabItem
                                key={account.id}
                                account={account}
                                appwriteItemId={appwriteItemId}
                            />
                        </TabsTrigger>
                    ))}
                </TabsList>

                {accounts.map((account: Account) => (
                    <TabsContent
                        value={account.appwriteItemId}
                        key={account.id}
                        className="space-y-4"
                    >
                        <BankInfo
                            account={account}
                            appwriteItemId={appwriteItemId}
                            type="full"
                        />

                        <RecentTransactions appwriteItemId={account.appwriteItemId} />
                    </TabsContent>
                ))}
            </Tabs>
        </section>
    )
}
