"use client";
import Piwo from "@/components/piwo";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarSeparator,
    useSidebar,
} from "@/components/ui/sidebar";
import { menuItems } from "@/components/ui/nav-menu-items";
import { useCurrentLocale, useI18n } from "@/locales/client";
import { CurrentUserAvatar } from "@/components/current-user-avatar";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { Settings, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import ErrorMessage from "@/components/ui/error-message";
import { useState } from "react";

export function AppSidebar({ user }: { user: User | null }) {
    const [errorMessage, setError] = useState<string | null>(null);
    const { open, openMobile, isMobile } = useSidebar();
    const t = useI18n();
    const locale = useCurrentLocale();
    const router = useRouter();
    const logOut = async () => {
        const supabase = createClient();
        const { error } = await supabase.auth.signOut();
        if (error) {
            setError(`${error.code}: ${error.message}`);
        }
        router.refresh();
    };
    return (
        <Sidebar
            side="left"
            variant="sidebar"
            className="shadow-md antialiased backdrop-blur-md bg-background/50 bg-opacity-80 z-20"
        >
            <SidebarHeader className="my-4">
                <SidebarMenuButton size="lg">
                    <div
                        className={open || openMobile ? "w-12 h-12" : "w-8 h-8"}
                    >
                        <Piwo
                            width={open || openMobile ? 48 : 32}
                            height={open || openMobile ? 48 : 32}
                        />
                    </div>
                    <h4
                        className={`${
                            open || openMobile
                                ? "scale-100 opacity-100"
                                : "hidden scale-0 opacity-0"
                        } transition-all ease-in-out`}
                    >
                        Piwo Paliwo 2.0
                    </h4>
                </SidebarMenuButton>
            </SidebarHeader>
            <SidebarContent className="p-2">
                {menuItems
                    .filter((menuItem) => menuItem.status === "active")
                    .map((mainMenuItem, index) => (
                        <SidebarMenuItem key={index}>
                            <Link href={`/${locale}${mainMenuItem.link}`}>
                                <SidebarMenuButton className="cursor-pointer">
                                    <mainMenuItem.icon />
                                    <span>
                                        {
                                            // @ts-expect-error structured with the translation
                                            t(`NavMenu.${mainMenuItem.id}`)
                                        }
                                    </span>
                                </SidebarMenuButton>
                            </Link>
                            {(mainMenuItem?.children || []).map(
                                (childMenuItem, childIndex) => (
                                    <SidebarMenuSub key={childIndex}>
                                        <SidebarMenuSubItem>
                                            <SidebarMenuSubButton
                                                href={`/${locale}${childMenuItem.link}`}
                                                className="cursor-pointer"
                                            >
                                                <childMenuItem.icon />
                                                <span>
                                                    {t(
                                                        // @ts-expect-error invalid type setting
                                                        `NavMenu.${childMenuItem.id}`
                                                    )}
                                                </span>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    </SidebarMenuSub>
                                )
                            )}
                        </SidebarMenuItem>
                    ))}
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton
                                    size="lg"
                                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                >
                                    <CurrentUserAvatar className="h-8 w-8" />
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="font-medium truncate">
                                            {user?.user_metadata?.firstName}{" "}
                                            {user?.user_metadata?.lastName}
                                        </span>
                                    </div>
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                                side={isMobile ? "bottom" : "right"}
                                align="end"
                                sideOffset={4}
                            >
                                <DropdownMenuItem>
                                    <Link
                                        href={`/${locale}/settings`}
                                        className="flex flex-row gap-2 items-center w-full cursor-pointer"
                                    >
                                        <Settings /> {t("settings")}
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <button
                                        className="flex flex-row gap-2 items-center w-full cursor-pointer"
                                        onClick={logOut}
                                    >
                                        <LogOut /> {t("logOut")}
                                    </button>
                                    {errorMessage && (
                                        <ErrorMessage error={errorMessage} />
                                    )}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
