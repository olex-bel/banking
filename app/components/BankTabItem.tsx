
import { cn } from "../libs/utils";

export default function BankTabItem({ account }: BankTabItemProps) {
    return (
        <div>
            <p
                className={cn(`text-16 line-clamp-1 flex-1 font-medium text-gray-500`, {
                    " text-blue-600": false,
                })}
            >
                {account.name}
            </p>
        </div>
    );
}
