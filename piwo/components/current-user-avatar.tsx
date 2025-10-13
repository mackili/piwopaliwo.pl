"use client";

import { useCurrentUserImage } from "@/hooks/use-current-user-image";
import { useCurrentUserName } from "@/hooks/use-current-user-name";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { User } from "@supabase/supabase-js";

export const CurrentUserAvatar = ({
    className,
    user,
}: { user?: User | null | undefined } & React.ComponentProps<
    typeof AvatarPrimitive.Root
>) => {
    const profileImage = useCurrentUserImage(user);
    const name = useCurrentUserName(user);
    const initials = name
        ?.split(" ")
        ?.map((word) => word[0])
        ?.join("")
        ?.toUpperCase();

    return (
        <Avatar className={className}>
            {profileImage && (
                <AvatarImage
                    src={profileImage}
                    alt={initials}
                    className="rounded-full"
                />
            )}
            <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
    );
};
