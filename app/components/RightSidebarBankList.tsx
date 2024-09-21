
import BankCard from "./BankCard";

type RightSidebarProps = {
    user: {
        firstName: string;
        lastName: string;
        email: string;
    },
    banks: Account[];
};

export default function RightSidebarBankList({ user, banks = [] }: RightSidebarProps) {
    return (
        <>
            {banks?.length > 0 && (
                <div className="relative flex flex-1 flex-col items-center justify-center gap-5">
                    <div className='relative z-10'>
                        <BankCard
                            key={banks[0].id}
                            account={banks[0]}
                            userName={`${user.firstName} ${user.lastName}`}
                            showBalance={false}
                        />
                    </div>
                    {banks[1] && (
                        <div className="absolute right-0 top-8 z-0 w-[90%]">
                            <BankCard
                                key={banks[1].id}
                                account={banks[1]}
                                userName={`${user.firstName} ${user.lastName}`}
                                showBalance={false}
                            />
                        </div>
                    )}
                </div>
            )}
        </>
    );
}