import { Tables } from "@/database.types";
import {
    Card,
    CardAction,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ParticipantResponseJson } from "../fetch";
import { TripParticipantAvatar } from "./participant-avatars";
import { createClient } from "@/utils/supabase/server";
import TripParticipantsInvite from "./participants-invite";
import { twMerge } from "tailwind-merge";
import { getCurrentUserParticipant, permissionsReducer } from "../permissions";
import TripParticipantStatusPicker from "./participant-status-picker";
import TripParticipantRolePicker from "./participant-role-picker";

export default async function TripParticipantsCard({
    trip,
    variant = "basic",
}: {
    trip: Tables<"v_trip_details">;
    variant?: "basic" | "expanded";
}) {
    const [supabase] = await Promise.all([createClient()]);
    const {
        data: { user },
    } = await supabase.auth.getUser();
    const currentUserParticipant = user?.id
        ? getCurrentUserParticipant(
              trip.participants as ParticipantResponseJson[],
              user.id,
          )
        : undefined;
    return (
        <Card>
            <CardHeader>
                <CardAction>
                    {currentUserParticipant &&
                        permissionsReducer({
                            tripParticipantRole: currentUserParticipant.role,
                            permission: "invite_participants",
                        }) && <TripParticipantsInvite trip={trip} />}
                </CardAction>
                <CardTitle>Participants</CardTitle>
            </CardHeader>
            <CardContent className="@container">
                {((trip.participants as ParticipantResponseJson[]) || []).map(
                    (participant) => (
                        <div
                            className={twMerge(
                                "inline-flex gap-2 w-full p-2 rounded-lg transition-all ease-in-out hover:outline-muted hover:outline-2 outline-0 items-center",
                                variant === "expanded"
                                    ? "grid grid-cols-12"
                                    : "",
                            )}
                            key={participant.id}
                        >
                            <div
                                className={twMerge(
                                    "inline-flex gap-2",
                                    variant === "expanded" ? "col-span-6" : "",
                                )}
                            >
                                <TripParticipantAvatar
                                    participant={participant}
                                    avatarSize="sm"
                                />
                                <p>
                                    {participant.group_member?.nickname ||
                                        `${participant?.user?.first_name} ${participant?.user?.last_name}`}{" "}
                                    {currentUserParticipant?.id ===
                                        participant.id && (
                                        <span className="text-muted-foreground">
                                            (you)
                                        </span>
                                    )}
                                </p>
                            </div>
                            <div
                                className={twMerge(
                                    "inline-flex grow gap-1 text-muted-foreground items-center justify-end",
                                    variant === "expanded" &&
                                        "col-span-6 grid-cols-subgrid",
                                )}
                            >
                                {variant === "expanded" && (
                                    <TripParticipantRolePicker
                                        participant={participant}
                                        className="grid-cols-1"
                                        canEdit={
                                            currentUserParticipant &&
                                            permissionsReducer({
                                                tripParticipantRole:
                                                    currentUserParticipant.role,
                                                permission:
                                                    "modify_permissions",
                                            })
                                        }
                                    />
                                )}
                                <TripParticipantStatusPicker
                                    participant={participant}
                                    canEdit={
                                        currentUserParticipant &&
                                        (currentUserParticipant.id ===
                                            participant.id ||
                                            permissionsReducer({
                                                tripParticipantRole:
                                                    currentUserParticipant.role,
                                                permission:
                                                    "change_others_statuses",
                                            }))
                                    }
                                />
                            </div>
                        </div>
                    ),
                )}
            </CardContent>
        </Card>
    );
}
