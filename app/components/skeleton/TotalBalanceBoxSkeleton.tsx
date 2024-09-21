
export default function TotalBalanceBoxSkeleton() {
    return (
        <section className="animate-pulse total-balance">
            <div className="rounded-full bg-slate-200 h-[120px] w-[120px]"></div>
            <div className="flex flex-col gap-6 w-32">
                <div className="h-4 bg-slate-200 rounded"></div>
                <div className="h-3 w-28 bg-slate-200 rounded"></div>
                <div className="h-3 w-28 bg-slate-200 rounded"></div>
            </div>
        </section>
    );
}