import { ComponentProps } from "react";
import { Group, GroupMember } from "../types";
import {
    Card,
    CardAction,
    CardContent,
    CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import NewElementButton from "../(components)/(actions)/new-element-button";
import GroupMemberForm from "../(components)/(actions)/group-member-form";
import UserRow from "@/components/ui/user-row";

export function memberName({ member }: { member: GroupMember }) {
    const nickname = member.nickname;
    const firstName = member.user?.firstName;
    const lastName = member.user?.lastName;
    const fullName = `${firstName || ""} ${lastName || ""}`;
    return fullName.length > 1 ? fullName : nickname;
}

export default function GroupMembersTable({
    group,
    ...props
}: { group: Group } & ComponentProps<"div">) {
    return (
        <Card {...props}>
            <CardHeader>
                <div className="flex flex-row gap-2">
                    <h4>Members</h4>
                    <p className="flex items-center">
                        <Badge variant="outline" className="aspect-square">
                            {group.members?.length || 0}
                        </Badge>
                    </p>
                </div>
                <CardAction>
                    <NewElementButton
                        buttonLabel="Add Member"
                        dialogTitle="New Member"
                        formProps={{
                            data: {
                                id: "",
                                group_id: group.id,
                                nickname: "",
                                user_id: null,
                            },
                        }}
                        FormComponent={GroupMemberForm}
                    />
                </CardAction>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 max-h-128">
                {group?.members &&
                    group.members.map((member) => (
                        <UserRow
                            key={member.id}
                            user={member?.user}
                            userName={memberName({ member: member })}
                        />
                    ))}
            </CardContent>
        </Card>
    );
}
