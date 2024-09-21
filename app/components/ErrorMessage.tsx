
import type { ReactNode } from "react"

type ErrorMessageProps = {
    children: ReactNode;
};

export default function ErrorMessage({ children }: ErrorMessageProps) {
    return <em className="text-red-600">{children}</em>
}
