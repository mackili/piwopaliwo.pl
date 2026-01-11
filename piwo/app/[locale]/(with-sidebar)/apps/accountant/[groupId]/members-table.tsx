"use client";
import { ComponentProps } from "react";
import { Group, GroupMember, GroupMemberStatus } from "../types";
import {
    Card,
    CardAction,
    CardContent,
    CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import NewElementButton from "@/components/accountant/actions/new-element-button";
import GroupMemberForm from "@/components/accountant/actions/group-member-form";
import UserRow from "@/components/ui/user-row";
import { CheckIcon, CrownIcon, MailIcon, XIcon } from "lucide-react";
import { useI18n } from "@/locales/client";

export function memberName({ member }: { member: GroupMember }) {
    const nickname = member.nickname;
    const firstName = member.user?.firstName;
    const lastName = member.user?.lastName;
    const fullName = `${firstName || ""} ${lastName || ""}`;
    return fullName.length > 1 ? fullName : nickname;
}

const MemberStatusSymbol = (status: GroupMemberStatus) => {
    let icon = <></>;
    switch (status) {
        case "owner":
            icon = <CrownIcon />;
            break;
        case "accepted":
            icon = <CheckIcon />;
            break;
        case "rejected":
            icon = <XIcon />;
            break;
        case "invited":
            icon = <MailIcon />;
            break;
        default:
            break;
    }
    return icon;
};

export default function GroupMembersTable({
    group,
    groupMembers,
    ...props
}: { group: Group; groupMembers: GroupMember[] } & ComponentProps<"div">) {
    const t = useI18n();
    return (
        <Card {...props}>
            <CardHeader>
                <div className="flex flex-row gap-2">
                    <h4>{t("Accountant.members")}</h4>
                    <p className="flex items-center">
                        <Badge variant="outline" className="aspect-square">
                            {groupMembers?.length || 0}
                        </Badge>
                    </p>
                </div>
                <CardAction>
                    <NewElementButton
                        buttonLabel={t("Accountant.addMember")}
                        dialogTitle={t("Accountant.addMember")}
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
            <CardContent className="flex flex-col gap-2 max-h-60 overflow-y-scroll">
                {groupMembers &&
                    groupMembers.map((member) => (
                        <NewElementButton
                            key={member.id}
                            variant="ghost"
                            size="lg"
                            className="overflow-hidden hover:bg-accent dark:hover:bg-accent px-2 py-2 h-12"
                            buttonLabel={
                                <div className="flex flex-row w-full items-center">
                                    <UserRow
                                        user={member?.user}
                                        userName={memberName({
                                            member: member,
                                        })}
                                        className="grow"
                                    />
                                    {member?.status &&
                                        MemberStatusSymbol(member.status)}
                                </div>
                            }
                            dialogTitle={t("Accountant.editMember")}
                            FormComponent={GroupMemberForm}
                            formProps={{
                                data: { ...member, group_id: group.id },
                            }}
                        />
                    ))}
            </CardContent>
        </Card>
    );
}
