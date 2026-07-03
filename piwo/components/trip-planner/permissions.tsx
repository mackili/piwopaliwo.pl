import { Database, Enums } from "@/database.types";
import { ParticipantResponseJson } from "./fetch";

export type TripParticipantPermissions =
    | "edit_info"
    | "invite_participants"
    | "modify_permissions"
    | "change_others_statuses"
    | "modify_accommodation"
    | "assign_accommodation"
    | "modify_transport"
    | "assign_transport"
    | "plan_budget"
    | "delete_trip";

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
            "plan_budget",
            "delete_trip",
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
            "plan_budget",
            "delete_trip",
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
    tripParticipantRole: Database["permissions"]["Enums"]["user_role"];
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
