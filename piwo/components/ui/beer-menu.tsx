"use client";
import Piwo from "../piwo";
// import NavigationMenuPP from "./nav-menu-items";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

export default function BeerMenu({
    isVisible = true,
    className,
    width = 64,
    height = 64,
}: {
    isVisible?: boolean;
    width?: number;
    height?: number;
} & React.ComponentProps<"button">) {
    const [navOpen, setNavOpen] = useState(false);
    useEffect(() => {
        if (!isVisible) setNavOpen(false);
    }, [isVisible]);
    return (
        <div className="relative inline">
            <button
                className={twMerge(
                    `h-16 w-16 transition-all hover:scale-105 hover:rotate-5 hover:perspective-dramatic hover:translate-x-2 hover:-translate-y-1
                    `,
                    className,
                )}
                onClick={() => setNavOpen(!navOpen)}
                disabled={!isVisible}
            >
                <Piwo width={width} height={height} />
            </button>
            {/* <NavigationMenuPP
                className={`mt-4 absolute ${
                    navOpen === true ? "scale-100" : "scale-0"
                }`}
            /> */}
        </div>
    );
}
