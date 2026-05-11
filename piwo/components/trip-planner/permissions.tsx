import { Enums } from "@/database.types";
import { ParticipantResponseJson } from "./fetch";

export type TripParticipantPermissions =
    | "edit_info"
    | "invite_participants"
    | "modify_permissions"
    | "change_others_statuses";

const PARTICIPANT_PERMISSIONS_MATRIX: {
    role: Enums<"trip_participant_role">;
    permissions: TripParticipantPermissions[];
}[] = [
    {
        role: "admin",
        permissions: [
            "edit_info",
            "invite_participants",
            "modify_permissions",
            "change_others_statuses",
        ],
    },
    {
        role: "owner",
        permissions: [
            "edit_info",
            "invite_participants",
            "modify_permissions",
            "change_others_statuses",
        ],
    },
    {
        role: "member",
        permissions: [],
    },
];

function getCurrentUserParticipant(
    participants: ParticipantResponseJson[],
    currentUserId: string,
) {
    return participants.find(
        (participant) => participant.user?.id === currentUserId,
    );
}

function permissionsReducer({
    tripParticipant,
    permission,
}: {
    tripParticipant: ParticipantResponseJson;
    permission: TripParticipantPermissions;
}) {
    return (
        PARTICIPANT_PERMISSIONS_MATRIX.find(
            (element) => element.role === tripParticipant.role,
        )?.permissions?.includes(permission) || false
    );
}

export {
    PARTICIPANT_PERMISSIONS_MATRIX,
    permissionsReducer,
    getCurrentUserParticipant,
};
