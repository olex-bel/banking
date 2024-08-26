
import type { ReactNode } from "react";

type HeaderBoxProps = {
    children: ReactNode;
    subtext: ReactNode;
};

export default function HeaderBox({ children, subtext }: HeaderBoxProps) {
    return (
        <div className="header-box">
            <h1 className="header-box-title">
                {children}
            </h1>

            <p className="header-box-subtext">{subtext}</p>
        </div>
    );
}