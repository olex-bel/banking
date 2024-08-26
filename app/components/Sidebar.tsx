
import { NavLink, Link } from "@remix-run/react";
import { cn } from "~/libs/utils";
import { sidebarLinks } from '../constants'

export default function Sidebar() {
    return (
        <section className="sidebar">
            <nav className="flex flex-col gap-4">
                <Link to="/" className="mb-12 cursor-pointer flex items-center gap-2">
                    <img 
                        src="/icons/logo.svg"
                        width={34}
                        height={34}
                        alt="Horizon logo"
                        className="size-[24px] max-xl:size-14"
                    />
                    <h1 className="sidebar-logo">Horizon</h1>
                </Link>

                {sidebarLinks.map((item) => {
                    return (
                        <NavLink to={item.route} key={item.label}
                            className={({ isActive }) => cn("sidebar-link", { "bg-bank-gradient": isActive })}
                        >
                            {
                                ({ isActive }) => (
                                    <>
                                        <div className="relative size-6">
                                            <img 
                                                src={item.imgURL}
                                                alt={item.label}
                                                className={cn({
                                                    "brightness-[3] invert-0": isActive
                                                })}
                                            />
                                        </div>
                                        <p className={cn("sidebar-label", { "!text-white": isActive })}>
                                            {item.label}
                                        </p>
                                    </>
                                )}
                        </NavLink>
                    )
                })}
            </nav>
        </section>
    );
}
