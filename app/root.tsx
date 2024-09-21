import { captureRemixErrorBoundaryError } from "@sentry/remix";
import { Links, Meta, Outlet, Scripts, ScrollRestoration, useRouteError } from "@remix-run/react";
import "./tailwind.css";

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <Meta />
                <Links />
            </head>
            <body>
                {children}
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}

export const ErrorBoundary = () => {
    const error = useRouteError();
    let errorMessage = "Unexpected Server Error";
    let stack;

    if (error instanceof Error) {
        stack = error.stack
        errorMessage = error.message;
    }

    captureRemixErrorBoundaryError(error);

    return (
        <div className="flex flex-col">
            <em className="text-red-600 text-center">{errorMessage}</em>
            <code>{stack}</code>
        </div>
    );
};

export default function App() {
    return <Outlet />;
}