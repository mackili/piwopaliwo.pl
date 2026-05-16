import { Enums } from "@/database.types";
import { ParticipantResponseJson } from "./fetch";

export type TripParticipantPermissions =
    | "edit_info"
    | "invite_participants"
    | "modify_permissions"
    | "change_others_statuses"
    | "modify_accommodation"
    | "assign_accommodation"
    | "modify_transport"
    | "assign_transport";

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
            "modify_accommodation",
            "assign_accommodation",
            "modify_transport",
            "assign_transport",
        ],
    },
    {
        role: "owner",
        permissions: [
            "edit_info",
            "invite_participants",
            "modify_permissions",
            "change_others_statuses",
            "modify_accommodation",
            "assign_accommodation",
            "modify_transport",
            "assign_transport",
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
    tripParticipantRole,
    permission,
}: {
    tripParticipantRole: Enums<"trip_participant_role">;
    permission: TripParticipantPermissions;
}) {
    return (
        PARTICIPANT_PERMISSIONS_MATRIX.find(
            (element) => element.role === tripParticipantRole,
        )?.permissions?.includes(permission) || false
    );
}

export {
    PARTICIPANT_PERMISSIONS_MATRIX,
    permissionsReducer,
    getCurrentUserParticipant,
};
