
import { Outlet } from "@remix-run/react";
import Sidebar from "~/components/Sidebar";
import MobileNav from "~/components/MobileNav";

export default function AppLayout() {
    return (
        <main className="flex h-screen w-full font-inter">
            <Sidebar />

            <div className="flex size-full flex-col">
                <div className="root-layout">
                    <img src="/icons/logo.svg" width={30} height={30} alt="logo" />
                    <div>
                        <MobileNav />
                    </div>
                </div>
                <Outlet/>
            </div>
        </main>
    );
}