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
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";
import NavigationMenuPP, { menuItems } from "@/components/ui/nav-menu-items";
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
        <Sidebar side="left" variant="floating" collapsible="icon">
            <SidebarHeader>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton size="lg">
                            <div
                                className={
                                    open || openMobile ? "w-12 h-12" : "w-8 h-8"
                                }
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
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg relative inline"
                        align="start"
                        side={isMobile ? "bottom" : "right"}
                        sideOffset={4}
                    >
                        <NavigationMenuPP className="absolute" />
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup />
                <SidebarGroup />
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        {/* <div className="w-full h-16"> */}
                        {/* <UserNav className="h-16 w-16" /> */}
                        {/* </div> */}
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
