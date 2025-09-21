"use client";
import { organization } from "@/public/statics";
import { useEffect, useState } from "react";
import Piwo from "./piwo";
import NavigationMenuPP from "./ui/nav-menu-items";

export default function NavBar() {
    const [isVisible, setVisible] = useState(true);
    const [hasMounted, setHasMounted] = useState(false);
    useEffect(() => {
        setHasMounted(true);
        let lastScrollY = window.scrollY;
        const controlNavbar = () => {
            const currentScrollY = window.scrollY;
            setVisible(!(currentScrollY > lastScrollY && currentScrollY > 100));
            lastScrollY = currentScrollY;
        };
        window.addEventListener("scroll", controlNavbar);
        return () => window.removeEventListener("scroll", controlNavbar);
    }, []);
    return (
        <div
            className={`fixed top-0 left-0 z-1000 w-full flex px-8 border-b-2 shadow-xs border-sidebar-border flex-row flex-wrap items-center justify-between gap-8 transition-all antialiased backdrop-blur-xs ${
                hasMounted && isVisible
                    ? "sm:py-8 py-2 bg-sidebar/90"
                    : "py-2 bg-sidebar/50"
            }`}
        >
            <div
                id="organization-info"
                className={`flex flex-row flex-nowrap gap-8 h-16 items-center-safe transition-all ${
                    hasMounted && isVisible ? "" : "scale-60"
                }  origin-left`}
            >
                <div
                    id="organization-logo"
                    className="inline w-16 h-full transition-all hover:scale-120 hover:rotate-15 hover:perspective-dramatic hover:translate-x-2 hover:-translate-y-2"
                >
                    <Piwo width={64} height={64} />
                </div>
                <div className="flex">
                    <h2 className="text-xl! sm:text-3xl!">
                        {organization.name}
                    </h2>
                </div>
            </div>
            <div
                id="navbar"
                className={`h-full flex md:min-w-[400px] lg:min-w-[500px] transition-all ${
                    isVisible ? "" : "scale-90"
                }`}
            >
                <NavigationMenuPP />
                <div id="user" className="flex h-full"></div>
            </div>
        </div>
    );
}
