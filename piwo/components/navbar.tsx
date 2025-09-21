"use client";
import { organization, menuItems } from "@/public/statics";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuViewport,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const listItemCSS =
    "flex flex-col flex-wrap gap-1 w-full justify-start justify-items-start rounded-md p-2 outline-hidden select-none hover-effect";

export default function NavBar() {
    const [isVisible, setVisible] = useState(true);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    useEffect(() => {
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
                isVisible ? "sm:py-8 py-2 bg-sidebar/90" : "py-2 bg-sidebar/50"
            }`}
        >
            <div
                id="organization-info"
                className={`flex flex-row flex-nowrap gap-8 h-16 items-center-safe transition-all ${
                    isVisible ? "" : "scale-60"
                }`}
            >
                <div
                    id="organization-logo"
                    className="bg-accent inline w-16 h-full"
                >
                    placeholder
                </div>
                <div className="flex">
                    <h1>{organization.name}</h1>
                </div>
            </div>
            <div
                id="navbar"
                className={`h-full flex md:min-w-[400px] lg:min-w-[500px] transition-all ${
                    isVisible ? "" : "scale-90"
                }`}
            >
                <NavigationMenu>
                    <NavigationMenuList>
                        {menuItems.map((item, index) => (
                            <NavigationMenuItem key={index}>
                                {item.children && item.children.length > 0 ? (
                                    <>
                                        <NavigationMenuTrigger>
                                            {item.title}
                                        </NavigationMenuTrigger>
                                        <NavigationMenuContent>
                                            <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr] p-2">
                                                <li className="h-full">
                                                    <Link
                                                        href={item.link}
                                                        className={twMerge(
                                                            listItemCSS,
                                                            "h-full"
                                                        )}
                                                    >
                                                        <h4>{item.title}</h4>
                                                        <p>
                                                            {item?.description}
                                                        </p>
                                                    </Link>
                                                </li>
                                                <li className="flex flex-col gap-2">
                                                    {item?.children.map(
                                                        (childItem, index) => (
                                                            <Link
                                                                key={index}
                                                                href={
                                                                    childItem.link
                                                                }
                                                                className={twMerge(
                                                                    listItemCSS
                                                                )}
                                                            >
                                                                <div className="flex flex-col flex-wrap gap-1">
                                                                    <h4 className="!text-base">
                                                                        {
                                                                            childItem.title
                                                                        }
                                                                    </h4>
                                                                    {childItem.description && (
                                                                        <p className="text-sm">
                                                                            {
                                                                                childItem.description
                                                                            }
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </Link>
                                                        )
                                                    )}
                                                </li>
                                            </ul>
                                        </NavigationMenuContent>
                                    </>
                                ) : (
                                    <NavigationMenuLink
                                        asChild
                                        className={navigationMenuTriggerStyle()}
                                    >
                                        <Link href={item.link}>
                                            {item.title}
                                        </Link>
                                    </NavigationMenuLink>
                                )}
                            </NavigationMenuItem>
                        ))}
                    </NavigationMenuList>
                    <NavigationMenuViewport />
                </NavigationMenu>
                <div id="user" className="flex h-full"></div>
            </div>
        </div>
    );
}
