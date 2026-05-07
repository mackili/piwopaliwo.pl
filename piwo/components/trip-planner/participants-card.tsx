import { Tables } from "@/database.types";
import {
    Card,
    CardAction,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ParticipantResponseJson } from "./fetch";
import {
    TripParticipantAvatar,
    TripParticipantStatusIcon,
} from "./participant-avatars";
import { createClient } from "@/utils/supabase/server";
import TripParticipantsInvite from "./participants-invite";

export default async function TripParticipantsCard({
    trip,
}: {
    trip: Tables<"v_trip_details">;
}) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    return (
        <Card>
            <CardHeader>
                <CardAction>
                    <TripParticipantsInvite trip={trip} disabled />
                </CardAction>
                <CardTitle>Participants</CardTitle>
            </CardHeader>
            <CardContent>
                {((trip.participants as ParticipantResponseJson[]) || []).map(
                    (participant) => (
                        <div
                            className="inline-flex gap-2 w-full"
                            key={participant.id}
                        >
                            <TripParticipantAvatar
                                participant={participant}
                                avatarSize="sm"
                            />
                            <p>
                                {participant.group_member?.nickname ||
                                    `${participant?.user?.first_name} ${participant?.user?.last_name}`}{" "}
                                {user && user.id === participant?.user?.id && (
                                    <span className="text-muted-foreground">
                                        (you)
                                    </span>
                                )}
                            </p>
                            <p className="inline-flex grow gap-1 text-muted-foreground items-center justify-end">
                                <TripParticipantStatusIcon
                                    participant={participant}
                                    className="w-4 h-4 stroke-3"
                                    isColorCoded
                                />
                                {participant.status}
                            </p>
                        </div>
                    ),
                )}
            </CardContent>
        </Card>
    );
}
