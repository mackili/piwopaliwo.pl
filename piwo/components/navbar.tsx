"use client";
import { organization } from "@/public/statics";
import { useEffect, useState } from "react";
import Piwo from "./piwo";
import NavigationMenuPP from "./ui/nav-menu-items";

export default function NavBar() {
    const [isVisible, setVisible] = useState(true);
    const [hasMounted, setHasMounted] = useState(false);
    const [navTriggered, setNavTriggered] = useState(false);
    const [navOpen, setNavOpen] = useState(false);

    useEffect(() => {
        setHasMounted(true);
        let lastScrollY = window.scrollY;
        const controlNavbar = () => {
            const currentScrollY = window.scrollY;
            const visible = !(
                currentScrollY > lastScrollY && currentScrollY > 100
            );
            setVisible(visible);
            if (!visible && navOpen === true) {
                console.log(false);
                setNavTriggered(false);
            }
            lastScrollY = currentScrollY;
        };
        window.addEventListener("scroll", controlNavbar);
        return () => window.removeEventListener("scroll", controlNavbar);
    }, [navOpen]);

    useEffect(() => {
        setNavOpen(navTriggered);
    }, [navTriggered]);
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
                <div id="organization-logo" className={`relative inline`}>
                    <button
                        className={`h-16 w-16 transition-all hover:scale-110 hover:rotate-5 hover:perspective-dramatic hover:translate-x-2 hover:-translate-y-2 ${
                            navOpen &&
                            "scale-105 rotate-10 translate-x-2 sm:-translate-y-2 perspective-dramatic"
                        } ${isVisible && "cursor-pointer"}`}
                        onClick={() => setNavTriggered(!navTriggered)}
                        disabled={!isVisible}
                    >
                        <Piwo width={64} height={64} />
                    </button>
                    <NavigationMenuPP
                        className={`mt-4 ${
                            navOpen === true ? "scale-100" : "scale-0"
                        }`}
                    />
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
                {/* <DropdownMenu /> */}
                <div id="user" className="flex h-full"></div>
            </div>
        </div>
    );
}
