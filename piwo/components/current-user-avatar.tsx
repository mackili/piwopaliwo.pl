"use client";

import { useCurrentUserImage } from "@/hooks/use-current-user-image";
import { useCurrentUserName } from "@/hooks/use-current-user-name";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { User } from "@supabase/supabase-js";
import { UserAvatar } from "./user-avatar";

export const CurrentUserAvatar = ({
    className,
    user,
}: { user?: User | null | undefined } & React.ComponentProps<
    typeof AvatarPrimitive.Root
>) => {
    const profileImage = useCurrentUserImage(user);
    const name = useCurrentUserName(user);

    return (
        <UserAvatar
            className={className}
            avatarUrl={profileImage}
            name={name}
        />
    );
};
