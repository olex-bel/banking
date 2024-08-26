
import { Link, NavLink } from "@remix-run/react"
import {
    Sheet,
    SheetContent,
    SheetClose,
    SheetTrigger,
  } from "./ui/sheet"
import AppLink from "./AppLink ";
import { cn } from "~/libs/utils";
import { sidebarLinks } from '../constants'

export default function MobileNav() {
    return (
        <section className="w-fulll max-w-[264px]">
            <Sheet>
                <SheetTrigger>
                    <img
                        src="/icons/hamburger.svg"
                        width={30}
                        height={30}
                        alt="menu"
                        className="cursor-pointer"
                    />
                </SheetTrigger>
                <SheetContent side="left" className="border-none bg-white">
                    <Link to="/" className="cursor-pointer flex items-center gap-1 px-4">
                        <img 
                            src="/icons/logo.svg"
                            width={34}
                            height={34}
                            alt="Horizon logo"
                        />
                        <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">Horizon</h1>
                    </Link>
                    <div className="mobilenav-sheet">
                        <SheetClose asChild>
                            <nav className="flex h-full flex-col gap-6 pt-16 text-white">
                                {sidebarLinks.map((item) => {
                                    return (
                                        <SheetClose asChild key={item.route}>
                                            <AppLink to={item.route} key={item.label}
                                                className="mobilenav-sheet_close w-full"
                                                activeClassName="bg-bank-gradient"
                                            >
                                                {
                                                    ({ isActive }) => (
                                                        <>
                                                            <img 
                                                                src={item.imgURL}
                                                                alt={item.label}
                                                                width={20}
                                                                height={20}
                                                                className={cn({
                                                                    'brightness-[3] invert-0': isActive
                                                                })}
                                                            />
                                                            <p className={cn("text-16 font-semibold text-black-2", { "text-white": isActive })}>
                                                                {item.label}
                                                            </p>
                                                        </>
                                                    )
                                                }
                                               
                                            </AppLink>
                                        </SheetClose>
                                    )
                                })}
                            </nav>
                        </SheetClose>
                    </div>
                </SheetContent>
            </Sheet>
        </section>
    )
}