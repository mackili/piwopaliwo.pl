"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { createClient } from "@/utils/supabase/client";
import {
    ComponentProps,
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { twMerge } from "tailwind-merge";

type UserHighlightContextProps = {
    highlightedUsers: string[] | null;
    setHighlightedUsers: (userIds: string[]) => void;
    cleanHighlightedUsers: () => void;
};

const UserHighlightContext = createContext<UserHighlightContextProps | null>(
    null,
);

function useUserHighlight() {
    const context = useContext(UserHighlightContext);
    if (!context) {
        throw new Error(
            "useUserHighlight must be used within UserHighlightContext",
        );
    }
    return context;
}

function UserHighlightContextProvider({
    defaultUserHighlight = [],
    children,
    ...props
}: {
    defaultUserHighlight?: string[];
} & ComponentProps<"div">) {
    const [_highlightedUsers, _setHighlightedUsers] =
        useState(defaultUserHighlight);
    const _cleanHighlightedUsers = () => {
        _setHighlightedUsers([]);
    };

    const contextValue: UserHighlightContextProps = useMemo(
        () => ({
            highlightedUsers: _highlightedUsers,
            setHighlightedUsers: _setHighlightedUsers,
            cleanHighlightedUsers: _cleanHighlightedUsers,
        }),
        [_highlightedUsers, _setHighlightedUsers, _cleanHighlightedUsers],
    );
    return (
        <UserHighlightContext.Provider value={contextValue}>
            {children}
        </UserHighlightContext.Provider>
    );
}

function UserHighlightToggle({
    label,
    className,
    ...props
}: { label?: string | null } & ComponentProps<"div">) {
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    useEffect(() => {
        const supabase = createClient();
        const fetchCurrentUserId = async () => {
            const { data } = await supabase.auth.getClaims();
            if (data) {
                setCurrentUserId(data.claims.sub);
            }
        };
        fetchCurrentUserId();
    }, []);
    const { highlightedUsers, setHighlightedUsers, cleanHighlightedUsers } =
        useUserHighlight();
    const isChecked =
        (highlightedUsers && highlightedUsers.length > 0) || false;
    return (
        <div
            className={twMerge("flex items-center space-x-2", className)}
            {...props}
        >
            <Switch
                id="user-highlight-timeline-toggle"
                disabled={!currentUserId}
                checked={isChecked}
                onCheckedChange={(checked) => {
                    if (currentUserId) {
                        setHighlightedUsers(checked ? [currentUserId] : []);
                    } else {
                        cleanHighlightedUsers();
                    }
                }}
            />
            {label && (
                <Label htmlFor="user-highlight-timeline-toggle">{label}</Label>
            )}
        </div>
    );
}

export { useUserHighlight, UserHighlightContextProvider, UserHighlightToggle };
