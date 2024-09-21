
import { Link } from "@remix-run/react";
import type { ReactNode } from "react";

type RightSidebarBanksProps = {
    children: ReactNode;
};

export default function RightSidebarBanks({ children }: RightSidebarBanksProps) {
    return (
        <section className="banks">
            <div className="flex w-full justify-between">
                <h2 className="header-2">My Banks</h2>
                <Link to="/" className="flex gap-2">
                    <img
                        src="/icons/plus.svg"
                        width={20}
                        height={20}
                        alt="plus"
                    />
                    <h2 className="text-14 font-semibold text-gray-600">
                        Add Bank
                    </h2>
                </Link>
            </div>

            {children}
        </section>
    );
}