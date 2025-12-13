import { ComponentProps } from "react";
import { UserAvatar } from "../user-avatar";
import { UserInfo } from "../scoretracker/types";
import { twMerge } from "tailwind-merge";

export default function UserRow({
    user,
    userName,
    ...props
}: { user?: UserInfo | null; userName: string } & ComponentProps<"div">) {
    return (
        <div
            {...props}
            className={twMerge(
                "flex flex-row gap-2 p-2 w-full items-center rounded-md hover:bg-accent transition-all",
                props?.className
            )}
        >
            <UserAvatar avatarUrl={user?.avatarUrl} name={userName} />
            {userName}
        </div>
    );
}
