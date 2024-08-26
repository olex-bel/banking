
import { ClientOnly } from 'remix-utils/client-only';
import CountUp from 'react-countup';

type AnimatedAmountProps = {
    amount: number;
};

export default function AnimatedAmount({ amount }: AnimatedAmountProps) {
    return (
        <div className="w-full">
            <ClientOnly>
                {() => <CountUp end={amount}  decimals={2} decimal="," prefix="$" />}
            </ClientOnly>
        </div>
    )
}