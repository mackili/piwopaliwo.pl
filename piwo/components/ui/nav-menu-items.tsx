"use client";
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
import { useCurrentLocale, useI18n } from "@/locales/client";

const listItemCSS =
    "flex flex-col flex-wrap gap-1 w-full justify-start justify-items-start rounded-md p-2 outline-hidden select-none hover-effect";
interface MenuItem {
    title?: string;
    description?: string;
    id: string;
    order?: number;

    link: string;
}

type AuxiliaryMenuItem = MenuItem;

type MainMenuItem = MenuItem & {
    children?: AuxiliaryMenuItem[];
    status: "active" | "disabled";
};

const menuItems: MainMenuItem[] = [
    { id: "home", order: 0, link: "/", status: "active" },
    {
        description: "Find all games offered on the platform here",
        id: "games",
        order: 10,
        link: "#",
        status: "disabled",
        children: [
            {
                description: `PiwoPaliwo's version of the famous economic game`,
                id: "piwopol",
                link: "#",
            },
            {
                id: "piwopol",
                link: "#",
            },
        ],
    },
    {
        id: "apps",
        order: 20,
        link: "#",
        status: "active",
        children: [
            {
                description: "NavMenu.scoreTracker_description",
                id: "scoreTracker",
                link: "/apps/scoretracker",
            },
            {
                description: "NavMenu.beerCounter_description",
                id: "beerCounter",
                link: "/apps/beercounter",
            },
        ],
    },
];

export default function NavigationMenuPP({
    ...props
}: React.ComponentProps<"div">) {
    const locale = useCurrentLocale();
    const t = useI18n();
    return (
        <div
            {...props}
            className={twMerge(
                "transition-all origin-top bg-sidebar/95 rounded-sm border-b-2 shadow-md border-sidebar-border antialiased backdrop-blur-2xl z-100",
                props.className
            )}
        >
            <NavigationMenu orientation="vertical">
                <NavigationMenuList className="flex flex-col">
                    {menuItems.map((item, index) => (
                        <NavigationMenuItem key={index}>
                            {item.children && item.children.length > 0 ? (
                                <>
                                    <NavigationMenuTrigger
                                        disabled={item.status === "disabled"}
                                    >
                                        {
                                            // @ts-expect-error structured with the translation
                                            t(`NavMenu.${item.id}`)
                                        }
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr] p-2 overflow-y-auto overflow-x-clip">
                                            <li className="h-full">
                                                <Link
                                                    href={`/${locale}${item.link}`}
                                                    className={twMerge(
                                                        listItemCSS,
                                                        "h-full"
                                                    )}
                                                >
                                                    <h4>
                                                        {t(
                                                            // @ts-expect-error structured with the translation
                                                            `NavMenu.${item.id}`
                                                        )}
                                                    </h4>
                                                    <p>
                                                        {t(
                                                            // @ts-expect-error structured with the translation
                                                            `NavMenu.${item.id}_description`
                                                        ) || ""}
                                                    </p>
                                                </Link>
                                            </li>
                                            <li className="flex flex-col gap-2">
                                                {item?.children.map(
                                                    (childItem, index) => (
                                                        <Link
                                                            key={index}
                                                            href={`/${locale}${childItem.link}`}
                                                            className={twMerge(
                                                                listItemCSS
                                                            )}
                                                        >
                                                            <div className="flex flex-col flex-wrap gap-1">
                                                                <h4 className="!text-base">
                                                                    {t(
                                                                        // @ts-expect-error structured with the translation
                                                                        `NavMenu.${childItem.id}`
                                                                    )}
                                                                </h4>
                                                                {childItem.description && (
                                                                    <p className="text-sm">
                                                                        {t(
                                                                            // @ts-expect-error structured with the translation
                                                                            childItem.description
                                                                        )}
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
                                    <Link href={`/${locale}${item.link}`}>
                                        {
                                            // @ts-expect-error structured with the translation
                                            t(`NavMenu.${item.id}`)
                                        }
                                    </Link>
                                </NavigationMenuLink>
                            )}
                        </NavigationMenuItem>
                    ))}
                </NavigationMenuList>
                <NavigationMenuViewport />
            </NavigationMenu>
        </div>
    );
}
