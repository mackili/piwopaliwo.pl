import {
    CheckCircle2Icon,
    CircleQuestionMarkIcon,
    MailQuestionMarkIcon,
    XCircleIcon,
} from "lucide-react";
import {
    Avatar,
    AvatarFallback,
    AvatarGroup,
    AvatarGroupCount,
    AvatarImage,
} from "../ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { ParticipantResponseJson } from "./fetch";
import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";
import { Enums } from "@/database.types";

function TripParticipantStatusIcon({
    status,
    className,
    isColorCoded = false,
    ...props
}: {
    status: Enums<"trip_participant_status">;
    isColorCoded?: boolean;
} & ComponentProps<"svg">) {
    let icon = <CircleQuestionMarkIcon className={className} {...props} />;
    switch (status) {
        case "confirmed":
            icon = (
                <CheckCircle2Icon
                    className={twMerge(
                        isColorCoded && "stroke-green-700",
                        className,
                    )}
                    {...props}
                />
            );
            break;
        case "declined":
            icon = (
                <XCircleIcon
                    className={twMerge(
                        isColorCoded && "stroke-red-700",
                        className,
                    )}
                    {...props}
                />
            );
            break;
        case "invited":
            icon = (
                <MailQuestionMarkIcon
                    className={twMerge(
                        isColorCoded && "stroke-blue-700",
                        className,
                    )}
                    {...props}
                />
            );
            break;
        default:
            break;
    }
    return icon;
}

function TripParticipantAvatar({
    participant,
    avatarSize = "default",
    showStatusIcon = false,
}: {
    participant: ParticipantResponseJson;
    avatarSize?: "default" | "sm" | "lg";
    showStatusIcon?: boolean;
}) {
    return (
        <Avatar size={avatarSize} className="relative">
            <AvatarImage
                src={participant.user?.avatar_url || undefined}
                alt={
                    participant.group_member?.nickname ||
                    `${participant.user?.first_name?.slice(0, 1)}${participant.user?.last_name?.slice(0, 1)}`
                }
            />
            <AvatarFallback>
                {`${participant.user?.first_name?.slice(0, 1)}${participant.user?.last_name?.slice(0, 1)}` ||
                    participant.group_member?.nickname}
            </AvatarFallback>
            {showStatusIcon && (
                <TripParticipantStatusIcon
                    status={participant.status}
                    className="absolute bottom-1 left-1 h-4 w-4 stroke-white stroke-2"
                />
            )}
        </Avatar>
    );
}

function TripParticipantAvatars({
    participants,
    avatarSize = "default",
    maxDisplayCount = 5,
    showStatusIcons = true,
}: {
    participants: ParticipantResponseJson[];
    avatarSize?: "default" | "sm" | "lg";
    maxDisplayCount?: number;
    showStatusIcons?: boolean;
}) {
    return (
        <AvatarGroup>
            {participants.slice(0, maxDisplayCount).map((participant) => (
                <Tooltip key={participant.id}>
                    <TooltipTrigger>
                        <TripParticipantAvatar
                            participant={participant}
                            avatarSize={avatarSize}
                            showStatusIcon={showStatusIcons}
                        />
                    </TooltipTrigger>
                    <TooltipContent>
                        <p className="inline-flex gap-1">
                            <TripParticipantStatusIcon
                                status={participant.status}
                                className="w-4 h-4"
                            />
                            {participant.group_member?.nickname ||
                                `${participant.user?.first_name}${participant.user?.last_name}`}
                        </p>
                    </TooltipContent>
                </Tooltip>
            ))}
            {participants.length > maxDisplayCount && (
                <AvatarGroupCount>{`+${participants.length - maxDisplayCount}`}</AvatarGroupCount>
            )}
        </AvatarGroup>
    );
}

export {
    TripParticipantAvatars,
    TripParticipantAvatar,
    TripParticipantStatusIcon,
};
