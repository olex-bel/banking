
import { useEffect } from "react";
import { useFetcher } from "@remix-run/react";
import TransactionsTable from "./TransactionsTable";

type RecentTransactionsProps = {
    appwriteItemId: string;
};

export default function RecentTransactions({ appwriteItemId } : RecentTransactionsProps) {
    const fetcher = useFetcher();

    useEffect(() => {
        if (fetcher.state === "idle" && !fetcher.data) {
            fetcher.load(`recent-transactions/${appwriteItemId}`);
        }
    }, [appwriteItemId, fetcher]);

    if (fetcher.state === "loading") {
        return (
            <div>Loading...</div>
        );
    }

    if (!fetcher.data) {
        return <></>
    }

    return (
        <TransactionsTable transactions={fetcher.data.transactions} />
    );
}
