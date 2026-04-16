import {
    Avatar,
    AvatarFallback,
    AvatarGroup,
    AvatarGroupCount,
    AvatarImage,
} from "../ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { ParticipantResponseJson } from "./fetch";

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
                        <Avatar size={avatarSize}>
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
                        </Avatar>
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

export { TripParticipantAvatars };
