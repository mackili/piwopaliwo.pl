"use client";

import { useCurrentUserImage } from "@/hooks/use-current-user-image";
import { useCurrentUserName } from "@/hooks/use-current-user-name";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

export const CurrentUserAvatar = ({
    className,
}: React.ComponentProps<typeof AvatarPrimitive.Root>) => {
    const profileImage = useCurrentUserImage();
    const name = useCurrentUserName();
    const initials = name
        ?.split(" ")
        ?.map((word) => word[0])
        ?.join("")
        ?.toUpperCase();

    return (
        <Avatar className={className}>
            {profileImage && <AvatarImage src={profileImage} alt={initials} />}
            <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
    );
};
