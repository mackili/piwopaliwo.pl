import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

export function UserAvatar({
    className,
    avatarUrl,
    name,
}: { avatarUrl?: string | null; name?: string | null } & React.ComponentProps<
    typeof AvatarPrimitive.Root
>) {
    const initials = name
        ?.split(" ")
        ?.map((word) => word[0])
        ?.join("")
        ?.toUpperCase();

    return (
        <Avatar className={className}>
            {avatarUrl && (
                <AvatarImage
                    src={avatarUrl}
                    alt={initials}
                    className="rounded-full"
                />
            )}
            <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
    );
}
