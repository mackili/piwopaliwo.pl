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
import { Badge } from "@/components/ui/badge";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { getI18n } from "@/locales/server";

export default async function TripParticipantsCard({
    trip,
    variant = "basic",
}: {
    trip: Tables<"v_trip_details">;
    variant?: "basic" | "expanded";
}) {
    const [supabase, t] = await Promise.all([createClient(), getI18n()]);
    const { data } = await supabase.auth.getClaims();
    const currentUserParticipant = data?.claims?.sub
        ? getCurrentUserParticipant(
              trip.participants as ParticipantResponseJson[],
              data.claims.sub,
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
                        }) && (
                            <TripParticipantsInvite
                                trip={trip}
                                showTextOnButton={variant === "expanded"}
                            />
                        )}
                </CardAction>
                <CardTitle className="flex flex-row gap-2 items-center">
                    {t("TripPlanner.tabs.participants")}
                    <Tooltip>
                        <TooltipTrigger>
                            <Badge className="bg-green-800">
                                {
                                    (
                                        trip.participants as ParticipantResponseJson[]
                                    )?.filter((p) => p.status === "confirmed")
                                        .length
                                }
                            </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                            {t("TripPlanner.participants.status.confirmed")}
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger>
                            <Badge className="bg-blue-700">
                                {
                                    (
                                        trip.participants as ParticipantResponseJson[]
                                    )?.filter(
                                        (p) =>
                                            p.status === "invited" ||
                                            p.status === "tentative",
                                    ).length
                                }
                            </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                            {t("TripPlanner.participants.status.tentative")}
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger>
                            <Badge className="bg-red-700">
                                {
                                    (
                                        trip.participants as ParticipantResponseJson[]
                                    )?.filter((p) => p.status === "declined")
                                        .length
                                }
                            </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                            {t("TripPlanner.participants.status.declined")}
                        </TooltipContent>
                    </Tooltip>
                </CardTitle>
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
                                    variant={
                                        variant === "expanded"
                                            ? "standard"
                                            : "small"
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
