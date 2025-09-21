"use client";
import { menuItems } from "@/public/statics";
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

const listItemCSS =
    "flex flex-col flex-wrap gap-1 w-full justify-start justify-items-start rounded-md p-2 outline-hidden select-none hover-effect";

export default function NavigationMenuPP() {
    return (
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
                                                <p>{item?.description}</p>
                                            </Link>
                                        </li>
                                        <li className="flex flex-col gap-2">
                                            {item?.children.map(
                                                (childItem, index) => (
                                                    <Link
                                                        key={index}
                                                        href={childItem.link}
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
                                <Link href={item.link}>{item.title}</Link>
                            </NavigationMenuLink>
                        )}
                    </NavigationMenuItem>
                ))}
            </NavigationMenuList>
            <NavigationMenuViewport />
        </NavigationMenu>
    );
}
