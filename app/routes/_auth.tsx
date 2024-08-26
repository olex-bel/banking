
import { Outlet } from "@remix-run/react";

export default function Index() {
    return (
        <main className="flex min-h-screen w-full justify-between font-inter">
            <Outlet />
            <div className="auth-asset">
                <div>
                <img 
                    src="/icons/auth-image.svg"
                    alt="Auth"
                    width={500}
                    height={500}
                    className="rounded-l-xl object-contain"
                />
                </div>
            </div>
        </main>
    );
}
