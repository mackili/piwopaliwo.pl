"use client";

import { LogOut, Settings } from "lucide-react";
import { AuthError, JwtPayload } from "@supabase/supabase-js";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuItem,
    DropdownMenuGroup,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { CurrentUserAvatar } from "../current-user-avatar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { Button } from "../ui/button";
import { useCurrentLocale, useI18n } from "@/locales/client";
import LoadingSpinner from "../ui/loading-spinner";

export default function UserNav({
    className,
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
    const t = useI18n();
    const locale = useCurrentLocale();
    const [loginState, setLoginState] = useState<
        "unknown" | "loggedIn" | "noLogin"
    >("unknown");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isLocaleSet, setLocaleSet] = useState(false);
    const router = useRouter();
    const supabase = createClient();
    const [user, setUser] = useState<JwtPayload>();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [logoutError, setLogoutError] = useState<AuthError | undefined>();
    const getUser = async () => {
        const { data } = await supabase.auth.getClaims();
        setUser(data?.claims);
        if (data?.claims) {
            setLoginState("loggedIn");
        }
        if (!data?.claims) {
            setLoginState("noLogin");
        }
    };
    useEffect(() => {
        getUser();
        setLocaleSet(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {}, [user]);

    const logOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            setLogoutError(error);
            return;
        }
        getUser();
        router.refresh();
    };

    return (
        <>
            <LoadingSpinner
                className={loginState === "unknown" ? className : "hidden"}
            />
            <Link
                href={`/${locale}/auth/login`}
                className={
                    loginState === "noLogin" ? "cursor-pointer" : "hidden"
                }
            >
                <Button variant="secondary">{t("logIn")}</Button>
            </Link>
            <DropdownMenu>
                <DropdownMenuTrigger
                    className={user ? "cursor-pointer" : "hidden"}
                >
                    <CurrentUserAvatar className={className} />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg z-200"
                    side={"bottom"}
                    align="end"
                    sideOffset={4}
                >
                    <DropdownMenuLabel className="p-0 font-normal">
                        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                            <CurrentUserAvatar className="h-8 w-8 rounded-lg" />
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">
                                    {`${user?.user_metadata.firstName} ${user?.user_metadata.lastName}`}
                                </span>
                                <span className="truncate text-xs">
                                    {user?.user_metadata?.email}
                                </span>
                            </div>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem>
                            <Link
                                href={`/${locale}/settings`}
                                className="flex flex-row gap-2 items-center w-full cursor-pointer"
                            >
                                <Settings /> {t("settings")}
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem>
                            <button
                                className="flex flex-row gap-2 items-center w-full cursor-pointer"
                                onClick={logOut}
                            >
                                <LogOut /> {t("logOut")}
                            </button>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}
