import { Tables, TablesInsert } from "@/database.types";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDaysIcon, Dot, MapPinIcon } from "lucide-react";
import { getCurrentLocale } from "@/locales/server";
import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";
import { TripParticipantAvatars } from "./participant-avatars";
import { ParticipantResponseJson } from "./fetch";
import { ButtonGroup } from "@/components/ui/button-group";
import EditTripForm from "./edit-trip";
import TripParticipantsInvite from "./participants-invite";
import { createClient } from "@/utils/supabase/server";
import { getCurrentUserParticipant, permissionsReducer } from "./permissions";

export function getNumberOfDays(start: string, end: string) {
    const date1 = new Date(start);
    const date2 = new Date(end);

    // One day in milliseconds
    const oneDay = 1000 * 60 * 60 * 24;

    // Calculating the time difference between two dates
    const diffInTime = date2.getTime() - date1.getTime();

    // Calculating the no. of days between two dates
    const diffInDays = Math.round(diffInTime / oneDay);

    return diffInDays;
}

export function getFormattedDates(start: string, end: string, locale: string) {
    return `${new Intl.DateTimeFormat(locale).format(new Date(start))} - ${new Intl.DateTimeFormat(locale).format(new Date(end))}`;
}

export default async function TripBanner({
    trip,
    className,
    ...props
}: {
    trip: Tables<"v_trip_details">;
} & ComponentProps<"div">) {
    const [locale, supabase] = await Promise.all([
        getCurrentLocale(),
        createClient(),
    ]);
    const {
        data: { user },
    } = await supabase.auth.getUser();
    const currentUserGroupParticipant = user?.id
        ? getCurrentUserParticipant(
              trip.participants as ParticipantResponseJson[],
              user.id,
          )
        : undefined;
    return (
        <Card
            {...props}
            className={twMerge(
                "bg-linear-to-br/shorter from-accent-2 to-accent",
                className,
            )}
        >
            <CardHeader>
                <div className="flex flex-row flex-wrap gap-2">
                    {trip?.location && (
                        <Badge variant="glass" className="text-secondary">
                            <MapPinIcon />
                            {trip.location}
                        </Badge>
                    )}
                    {trip && trip?.start_date && trip?.end_date && (
                        <Badge variant="glass" className="text-secondary">
                            <CalendarDaysIcon />
                            {getFormattedDates(
                                trip.start_date,
                                trip.end_date,
                                locale,
                            )}
                            <Dot />
                            {`${getNumberOfDays(trip.start_date, trip.end_date)} days`}
                        </Badge>
                    )}
                </div>
                {currentUserGroupParticipant && (
                    <CardAction>
                        <ButtonGroup>
                            {permissionsReducer({
                                tripParticipant: currentUserGroupParticipant,
                                permission: "edit_info",
                            }) && (
                                <EditTripForm
                                    trip={trip as TablesInsert<"trip">}
                                    displayMode="dialog"
                                    title="Edit Trip"
                                    className="max-sm:max-w-sm"
                                />
                            )}
                            {permissionsReducer({
                                tripParticipant: currentUserGroupParticipant,
                                permission: "invite_participants",
                            }) && <TripParticipantsInvite trip={trip} />}
                        </ButtonGroup>
                    </CardAction>
                )}
            </CardHeader>{" "}
            <CardContent className="flex flex-row flex-wrap gap-8 justify-between">
                <div className="flex flex-col gap-4">
                    <CardTitle className="font-serif text-secondary text-5xl font-extrabold">
                        {trip.name}
                    </CardTitle>
                    <CardDescription className="text-secondary font-medium text-lg">
                        {trip.description}
                    </CardDescription>
                </div>
                <div>
                    <TripParticipantAvatars
                        participants={(
                            (trip.participants as ParticipantResponseJson[]) ||
                            []
                        ).filter(
                            (participant) => participant.status !== "declined",
                        )}
                        avatarSize="lg"
                        maxDisplayCount={4}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
