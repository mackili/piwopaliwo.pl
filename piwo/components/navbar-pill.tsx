"use client";

import { useEffect, useMemo, useState } from "react";
import Piwo from "./piwo";
import { twMerge } from "tailwind-merge";
import Link, { useLinkStatus } from "next/link";
import { useI18n } from "@/locales/client";
import { useIsMobile } from "@/hooks/use-mobile";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardTitle,
} from "./ui/card";
import {
    BadgeCentIcon,
    BeerIcon,
    EqualApproximatelyIcon,
    Gamepad2Icon,
    HomeIcon,
    LucideIcon,
    NewspaperIcon,
    SailboatIcon,
    TerminalIcon,
    VolleyballIcon,
} from "lucide-react";
import { TranslationKey } from "@/locales/pl";

export interface MenuItem {
    title?: string;
    description?: TranslationKey;
    id: TranslationKey;
    order?: number;
    link?: string;
    icon: LucideIcon;
}

export type AuxiliaryMenuItem = MenuItem;

export type MainMenuItem = MenuItem & {
    children?: AuxiliaryMenuItem[];
    status: "active" | "disabled";
};

export const menuItems: MainMenuItem[] = [
    {
        id: "NavMenu.home",
        order: 0,
        link: "/",
        status: "active",
        icon: HomeIcon,
        children: [
            {
                description: "NavMenu.blog_description",
                id: "NavMenu.blog",
                icon: NewspaperIcon,
                link: "/blog",
            },
        ],
    },
    {
        description: "NavMenu.games_description",
        id: "NavMenu.games",
        order: 10,
        link: "#",
        status: "disabled",
        icon: Gamepad2Icon,
        children: [
            {
                id: "NavMenu.piwopol",
                icon: BadgeCentIcon,
                link: "#",
            },
        ],
    },
    {
        id: "NavMenu.apps",
        order: 20,
        link: "#",
        description: "NavMenu.apps_description",
        status: "active",
        icon: TerminalIcon,
        children: [
            {
                description: "NavMenu.accountant_description",
                id: "NavMenu.accountant",
                link: "/apps/accountant",
                icon: EqualApproximatelyIcon,
            },
            {
                description: "NavMenu.scoreTracker_description",
                id: "NavMenu.scoreTracker",
                link: "/apps/scoretracker",
                icon: VolleyballIcon,
            },
            {
                description: "NavMenu.beerCounter_description",
                id: "NavMenu.beerCounter",
                link: "/apps/beercounter",
                icon: BeerIcon,
            },
            {
                id: "NavMenu.tripPlanner",
                link: "/apps/trip-planner",
                icon: SailboatIcon,
            },
        ],
    },
] as const;

export default function NavBarPill() {
    const beerIconSize = 32 as const;
    const navMenuItemSize = 16 as const;
    const [isNavOpen, setNavOpen] = useState<boolean>(true);
    const navbarWidth = useMemo(() => {
        const gap = 8; // 8px
        const padding = 8; //8px
        const navMenuPixels = navMenuItemSize * 3;
        return (
            menuItems.length * (navMenuPixels + 2 * padding) +
            (menuItems.length - 1) * gap
        );
    }, [navMenuItemSize]);
    const t = useI18n();
    const isMobile = useIsMobile();

    useEffect(() => {
        let lastScrollY = window.scrollY;
        const controlNavbar = () => {
            const currentScrollY = window.scrollY;
            const visible = !(
                currentScrollY > lastScrollY && currentScrollY > 100
            );
            setNavOpen(visible);
            lastScrollY = currentScrollY;
        };
        window.addEventListener("scroll", controlNavbar);
        return () => window.removeEventListener("scroll", controlNavbar);
    }, []);
    return (
        <div
            className={twMerge(
                "fixed left-4 bottom-4 z-100 antialiased backdrop-blur-xs shadow-xs rounded-l-full rounded-r-full flex bg-sidebar/50",
                isMobile ? "flex-col-reverse" : "flex-row",
            )}
        >
            <button
                className={twMerge(
                    "transition-all ease-in-out cursor-pointer rounded-full bg-sidebar/50 p-4",
                )}
                onClick={() => setNavOpen(!isNavOpen)}
            >
                <div
                    className={twMerge(
                        "transition-all ease-in-out",
                        isNavOpen &&
                            "rotate-10 translate-x-1 perspective-dramatic",
                    )}
                >
                    <Piwo height={beerIconSize} width={beerIconSize} />
                </div>
            </button>
            <nav
                style={{
                    width: !isMobile
                        ? isNavOpen
                            ? `${navbarWidth}px`
                            : 0
                        : "auto",
                    height: isMobile
                        ? isNavOpen
                            ? `${navbarWidth}px`
                            : 0
                        : "auto",
                }}
                className={twMerge(
                    "transition-all ease-in-out origin-left flex gap-2 justify-center items-center overflow-hidden",
                    isNavOpen ? (isMobile ? "my-4" : "mx-4") : "",
                    isMobile ? "flex-col" : "flex-row",
                )}
            >
                {menuItems.map((item) => (
                    <NavItemDialog key={item.id} item={item}>
                        <button
                            className={twMerge(
                                `flex flex-col gap justify-center items-center align-center cursor-pointer aspect-square rounded-2xl hover:bg-sidebar/50 p-2`,
                                `w-${navMenuItemSize} h-${navMenuItemSize}`,
                                "origin-left transition-all ease-in-out",
                                isNavOpen ? "scale-100" : "scale-0",
                            )}
                        >
                            <item.icon className="stroke-primary" />
                            <p className="text-primary text-xs">
                                {
                                    // @ts-expect-error impossible to set correct type inference
                                    t(item.id)
                                }
                            </p>
                        </button>
                    </NavItemDialog>
                ))}
            </nav>
        </div>
    );
}

export function NavItemDialog({
    item,
    children,
}: { item: MainMenuItem } & Readonly<{
    children: React.ReactNode;
}>) {
    const [isDialogOpen, setDialogOpen] = useState<boolean>(false);
    const t = useI18n();
    return (
        <Dialog
            key={item.id}
            open={isDialogOpen}
            onOpenChange={setDialogOpen}
            defaultOpen={isDialogOpen}
        >
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="max-h-160">
                <DialogHeader>
                    <DialogTitle>
                        <div className="flex flex-row gap-4 flex-nowrap items-center text-wrap">
                            <item.icon className="stroke-2 scale-120" />
                            {t(
                                // @ts-expect-error impossible to set correct type inference
                                item.id,
                            )}
                        </div>
                    </DialogTitle>
                    {item?.description && (
                        <DialogDescription>
                            {t(
                                // @ts-expect-error impossible to set correct type inference
                                item.description,
                            )}
                        </DialogDescription>
                    )}
                </DialogHeader>
                <div className="flex flex-col gap-4 flex-wrap">
                    {item?.link && (
                        <Link href={item.link}>
                            <NavChildItem
                                item={item}
                                onRedirect={() => setDialogOpen(false)}
                            ></NavChildItem>
                        </Link>
                    )}
                    {item?.children?.map((child, index) => (
                        <Link key={index} href={child?.link || "#"}>
                            <NavChildItem
                                item={child}
                                onRedirect={() => setDialogOpen(false)}
                            />
                        </Link>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}

enum NavigationStatus {
    NOT_STARTED = "NOT_STARTED",
    PENDING = "PENDING",
    COMPLETED = "COMPLETED",
}

export function NavChildItem({
    item,
    onRedirect,
}: {
    item: AuxiliaryMenuItem;
    onRedirect: () => void;
}) {
    const { pending: isNavigationPending } = useLinkStatus();
    const [navigationStatus, setNavigationStatus] = useState<NavigationStatus>(
        NavigationStatus.NOT_STARTED,
    );
    useEffect(() => {
        if (isNavigationPending) {
            setNavigationStatus(NavigationStatus.PENDING);
        } else if (
            !isNavigationPending &&
            navigationStatus === NavigationStatus.PENDING
        ) {
            setNavigationStatus(NavigationStatus.COMPLETED);
        } else if (navigationStatus === NavigationStatus.COMPLETED) {
            onRedirect();
        }
    }, [isNavigationPending, navigationStatus, onRedirect]);
    const t = useI18n();
    return (
        <Card className={isNavigationPending ? "animate-pulse" : ""}>
            <CardContent>
                <CardTitle className="flex flex-row gap-2 flex-nowrap items-center text-wrap">
                    <item.icon />
                    {t(
                        // @ts-expect-error impossible to set correct type inference
                        item.id,
                    )}
                </CardTitle>
            </CardContent>
            {item?.description && (
                <CardFooter>
                    <CardDescription>
                        {t(
                            // @ts-expect-error impossible to set correct type inference
                            item.description,
                        )}
                    </CardDescription>
                </CardFooter>
            )}
        </Card>
    );
}
