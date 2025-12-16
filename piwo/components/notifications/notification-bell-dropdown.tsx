"use client";

import { BellIcon } from "lucide-react";
import { Button } from "../ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import {
    PostgrestError,
    REALTIME_SUBSCRIBE_STATES,
    RealtimePostgresChangesPayload,
} from "@supabase/supabase-js";
import { UserNotification } from "./types";
import { SupabaseResponse } from "@/utils/supabase/types";
import { Card, CardHeader } from "../ui/card";
import { useRouter } from "next/navigation";
import { useCurrentLocale } from "@/locales/client";
import PostgrestErrorDisplay from "../ui/postgrest-error-display";

export default function NotificationBellDropdown({
    userId,
}: {
    userId: string;
}) {
    const supabase = createClient();
    const router = useRouter();
    const locale = useCurrentLocale();
    const [notifications, setNotifications] = useState<UserNotification[]>([]);
    const [error, setError] = useState<PostgrestError>();
    const [subscriptionStatus, setSubscriptionStatus] =
        useState<REALTIME_SUBSCRIBE_STATES>();
    const fetchNotifications = async () => {
        const { data, error } = (await supabase
            .from("user_notification")
            .select()
            .eq("user_id", userId)
            .is("read_at", null)
            .order("created_at", {
                ascending: false,
            })) as SupabaseResponse<UserNotification>;
        if (error) {
            setError(error as PostgrestError);
        }
        if (data) {
            setNotifications(data);
        }
    };
    function removeNotificationFromArray(notificationId?: number) {
        if (notificationId) {
            setNotifications(
                [...notifications].filter(
                    (record) => record.id !== notificationId
                )
            );
        }
    }
    useEffect(() => {
        fetchNotifications();
        function upsertNotifications(
            payload: RealtimePostgresChangesPayload<UserNotification>
        ) {
            switch (payload.eventType) {
                case "INSERT":
                    setNotifications((prevNotifications) => [
                        payload.new,
                        ...prevNotifications,
                    ]);
                    break;
                case "UPDATE":
                    setNotifications((prevNotifications) => {
                        const prevIds = prevNotifications.map((not) => not.id);
                        if (prevIds.includes(payload.new.id)) {
                            const newArray = prevNotifications.map(
                                (notification) => {
                                    if (notification.id === payload.new.id) {
                                        return payload.new;
                                    } else {
                                        return notification;
                                    }
                                }
                            );
                            return newArray;
                        } else {
                            return [payload.new, ...prevNotifications];
                        }
                    });
                    break;
                case "DELETE":
                    removeNotificationFromArray(payload.old?.id);
                    break;
                default:
                    break;
            }
        }
        const notificationsChannel = supabase
            .channel("supabase_realtime")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "user_notification",
                    filter: `user_id=eq.${userId}`,
                },
                upsertNotifications
            )
            .subscribe((status, error) => {
                setSubscriptionStatus(status);
            });
        return () => {
            supabase.removeChannel(notificationsChannel);
        };
    }, []);
    async function handleClick(notification: UserNotification) {
        const data = { id: notification.id, read_at: new Date().toISOString() };
        const { error } = await supabase
            .from("user_notification")
            .update(data)
            .eq("id", notification.id);
        if (error) {
            setError(error);
        }
        if (notification.details?.href) {
            router.push(`/${locale}${notification.details.href}`);
        }
    }
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    type="button"
                    variant={
                        !subscriptionStatus ||
                        subscriptionStatus === "SUBSCRIBED"
                            ? "ghost"
                            : "destructive"
                    }
                    size="icon"
                    disabled={!subscriptionStatus}
                    className="relative"
                >
                    <BellIcon />
                    <div
                        className={`absolute top-2 right-2 bg-destructive w-2 h-2 rounded-full transition-all ease-in-out scale-0 origin-center border-0 antialiased z-1 ${
                            notifications.filter(
                                (notification) => !notification.read_at
                            ).length > 0 && "scale-100"
                        }`}
                    ></div>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-64 max-h-[300px] overflow-y-scroll">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications &&
                    notifications.map((notification) => (
                        <DropdownMenuItem
                            key={notification.id}
                            onClick={() => handleClick(notification)}
                        >
                            <Card
                                className={`w-full cursor-pointer h-auto ${
                                    !notification.read_at && "bg-secondary"
                                }`}
                            >
                                <CardHeader>
                                    <h4>{notification.title}</h4>
                                    {notification.details?.description && (
                                        <p>
                                            {notification.details.description}
                                        </p>
                                    )}
                                </CardHeader>
                            </Card>
                        </DropdownMenuItem>
                    ))}
                {error && <PostgrestErrorDisplay error={error} />}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
