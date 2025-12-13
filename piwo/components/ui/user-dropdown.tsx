import { UserInfo } from "../scoretracker/types";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./select";
import * as SelectPrimitive from "@radix-ui/react-select";
import UserRow from "./user-row";
import { ComponentProps } from "react";

export default function UserSelect({
    users,
    // defaultUser,
    ...props
}: {
    users: UserInfo[];
    // defaultUser?: UserInfo;
} & React.ComponentProps<typeof SelectPrimitive.Root> &
    ComponentProps<"select">) {
    const selectedUser = users.find((user) => user.userId === props.value);
    const filteredUsers = users.filter(
        (user) => typeof user?.userId === "string"
    );
    return (
        <Select {...props}>
            <SelectTrigger className={props?.className}>
                <SelectValue>
                    <UserRow
                        user={selectedUser}
                        userName={`${selectedUser?.firstName} ${
                            selectedUser?.lastName || ""
                        }`}
                        className="scale-80 origin-left"
                    />
                </SelectValue>
            </SelectTrigger>
            <SelectContent>
                {filteredUsers.map((user, index) => (
                    <SelectItem key={index} value={user.userId || ""}>
                        <UserRow
                            user={user}
                            userName={`${user.firstName} ${
                                user?.lastName || ""
                            }`}
                        />
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
