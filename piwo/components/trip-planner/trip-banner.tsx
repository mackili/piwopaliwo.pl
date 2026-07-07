import { TablesInsert } from "@/database.types";
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
import { getCurrentLocale, getI18n } from "@/locales/server";
import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";
import { TripParticipantAvatars } from "./participant-management/participant-avatars";
import { fetchTripDetails, ParticipantResponseJson } from "./fetch";
import { ButtonGroup } from "@/components/ui/button-group";
import EditTripForm from "./edit-trip";
import TripParticipantsInvite from "./participant-management/participants-invite";
import { createClient } from "@/utils/supabase/server";
import { getCurrentUserParticipant, permissionsReducer } from "./permissions";
import { getTripLength } from "./reducers";
import DeleteTrip from "./delete-trip";
import PostgrestErrorDisplay from "../ui/postgrest-error-display";
import GroupDetailsLink from "./groups/group-details-link";
import FormattedDateText from "../ui/formatted-date-text";

export function getFormattedDates(start: string, end: string, locale: string) {
    "use client";
    return `${new Intl.DateTimeFormat(locale).format(new Date(start))} - ${new Intl.DateTimeFormat(locale).format(new Date(end))}`;
}

export default async function TripBanner({
    tripSlug,
    className,
    ...props
}: {
    tripSlug: string;
} & ComponentProps<"div">) {
    const [locale, supabase, t] = await Promise.all([
        getCurrentLocale(),
        createClient(),
        getI18n(),
    ]);
    const [{ data: claims }, { data: trip, error }] = await Promise.all([
        supabase.auth.getClaims(),
        fetchTripDetails({ tripSlug: tripSlug }),
    ]);
    const currentUserGroupParticipant =
        claims?.claims?.sub && trip
            ? getCurrentUserParticipant(trip?.participants, claims.claims.sub)
            : undefined;
    return (
        <>
            <PostgrestErrorDisplay error={error} />
            {trip && (
                <Card
                    {...props}
                    className={twMerge(
                        "bg-linear-to-br/shorter from-accent-2 to-accent",
                        className,
                    )}
                >
                    <CardHeader className="flex flex-wrap justify-between flex-col-reverse sm:flex-row gap-4">
                        <div className="flex flex-row flex-wrap gap-2">
                            {trip?.location && (
                                <Badge
                                    variant="glass"
                                    className="text-secondary"
                                >
                                    <MapPinIcon />
                                    {trip.location}
                                </Badge>
                            )}
                            {trip && trip?.start_date && trip?.end_date && (
                                <Badge
                                    variant="glass"
                                    className="text-secondary"
                                >
                                    <CalendarDaysIcon />
                                    <FormattedDateText
                                        locale={locale}
                                        date={new Date(trip.start_date)}
                                    />{" "}
                                    -{" "}
                                    <FormattedDateText
                                        locale={locale}
                                        date={new Date(trip.end_date)}
                                    />
                                    <Dot />
                                    {`${getTripLength({ startdate: new Date(trip?.start_date) || "", endDate: new Date(trip?.end_date || "") })} days`}
                                </Badge>
                            )}
                        </div>
                        {currentUserGroupParticipant && (
                            <CardAction>
                                <ButtonGroup>
                                    {permissionsReducer({
                                        tripParticipantRole:
                                            currentUserGroupParticipant.role,
                                        permission: "edit_info",
                                    }) && (
                                        <EditTripForm
                                            trip={trip as TablesInsert<"trip">}
                                            displayMode="dialog"
                                            title={t("TripPlanner.editTrip")}
                                            className="max-sm:max-w-sm"
                                        />
                                    )}
                                    {permissionsReducer({
                                        tripParticipantRole:
                                            currentUserGroupParticipant.role,
                                        permission: "invite_participants",
                                    }) && (
                                        <TripParticipantsInvite trip={trip} />
                                    )}
                                    {trip?.group_id && (
                                        <GroupDetailsLink
                                            groupId={trip.group_id}
                                            size="icon"
                                            variant="secondary"
                                        />
                                    )}
                                    {permissionsReducer({
                                        tripParticipantRole:
                                            currentUserGroupParticipant.role,
                                        permission: "delete_trip",
                                    }) && <DeleteTrip trip={trip} />}
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
                                    (participant) =>
                                        participant.status !== "declined",
                                )}
                                showStatusIcons={false}
                                avatarSize="lg"
                                maxDisplayCount={4}
                            />
                        </div>
                    </CardContent>
                </Card>
            )}
        </>
    );
}
