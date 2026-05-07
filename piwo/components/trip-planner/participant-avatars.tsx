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

function TripParticipantStatusIcon({
    participant,
    className,
    isColorCoded = false,
    ...props
}: {
    participant: ParticipantResponseJson;
    isColorCoded?: boolean;
} & ComponentProps<"svg">) {
    let icon = <CircleQuestionMarkIcon className={className} {...props} />;
    switch (participant.status) {
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
            icon = <XCircleIcon className={className} {...props} />;
            break;
        case "invited":
            icon = <MailQuestionMarkIcon className={className} {...props} />;
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
                {participant.group_member?.nickname ||
                    `${participant.user?.first_name?.slice(0, 1)}${participant.user?.last_name?.slice(0, 1)}`}
            </AvatarFallback>
            {showStatusIcon && (
                <TripParticipantStatusIcon
                    participant={participant}
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
}: {
    participants: ParticipantResponseJson[];
    avatarSize?: "default" | "sm" | "lg";
    maxDisplayCount?: number;
}) {
    return (
        <AvatarGroup>
            {participants.slice(0, maxDisplayCount).map((participant) => (
                <Tooltip key={participant.id}>
                    <TooltipTrigger>
                        <TripParticipantAvatar
                            participant={participant}
                            avatarSize={avatarSize}
                            showStatusIcon={true}
                        />
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>
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
