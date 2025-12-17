"use client";
import { organization } from "@/public/statics";
import { useEffect, useState } from "react";
import UserNav from "./auth/user-nav";
import BeerMenu from "./ui/beer-menu";

export default function NavBar() {
    const [isVisible, setVisible] = useState(true);
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
        let lastScrollY = window.scrollY;
        const controlNavbar = () => {
            const currentScrollY = window.scrollY;
            const visible = !(
                currentScrollY > lastScrollY && currentScrollY > 100
            );
            setVisible(visible);
            lastScrollY = currentScrollY;
        };
        window.addEventListener("scroll", controlNavbar);
        return () => window.removeEventListener("scroll", controlNavbar);
    }, []);
    return (
        <div
            className={`fixed top-0 left-0 z-100 w-full max-w-screen flex px-8 border-b-2 shadow-xs border-sidebar-border flex-row flex-nowrap items-center justify-between gap-4 transition-all antialiased backdrop-blur-xs ${
                hasMounted && isVisible
                    ? "sm:py-8 py-2 bg-sidebar/50"
                    : "sm:py-2 bg-sidebar/30"
            }`}
        >
            <div
                id="organization-info"
                className={`flex flex-row flex-nowrap gap-8 h-16 items-center-safe transition-all ${
                    hasMounted && isVisible ? "" : "scale-60"
                }  origin-left`}
            >
                <BeerMenu isVisible={isVisible} />
                <div className="flex select-none">
                    <h2 className="text-xl! sm:text-3xl!">
                        {organization.name}
                    </h2>
                </div>
            </div>
            <div className="z-200">
                <UserNav
                    className={`transition-all font-bold drop-shadow-sm p-1 hover:scale-105 ${
                        isVisible === true
                            ? "sm:w-16 sm:h-16 sm:text-xl text-base w-14 h-14"
                            : "w-10 h-10 text-sm"
                    }`}
                />
            </div>
        </div>
    );
}
