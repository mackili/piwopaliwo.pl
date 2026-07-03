import PostgrestErrorDisplay from "@/components/ui/postgrest-error-display";
import { getCurrentLocale } from "@/locales/server";
import {
    fetchCurrentTripParticipant,
    fetchTripAccommodationSummary,
    fetchTripParticipantDetails,
} from "../fetch";
import TripAccommodationCardsOverview from "./accommodation-cards-overview";

export default async function TripAccommodationOverview({
    tripId,
}: {
    tripId: string;
}) {
    const [
        locale,
        { data, error },
        { data: currentTripParticipant },
        { data: tripParticipantDetails },
    ] = await Promise.all([
        getCurrentLocale(),
        fetchTripAccommodationSummary(tripId),
        fetchCurrentTripParticipant(tripId),
        fetchTripParticipantDetails(tripId, [
            "confirmed",
            "invited",
            "tentative",
        ]),
    ]);
    return (
        <div className="space-y-4">
            <div className="flex flex-row flex-wrap justify-between gap-4">
                <div className="space-y-2">
                    <p className="font-serif text-2xl font-bold">
                        Where we sleep
                    </p>
                    <p className="text-muted-foreground text-sm">
                        Bookings, accommodation, rooms, room-mate assignments.
                    </p>
                </div>
                <div className="flex flex-row flex-wrap gap-4"></div>
            </div>
            <div className="space-y-4">
                <PostgrestErrorDisplay error={error} />
                {currentTripParticipant && (
                    <TripAccommodationCardsOverview
                        tripId={tripId}
                        currentTripParticipant={currentTripParticipant}
                        accommodations={data || []}
                        potentialParticipants={tripParticipantDetails || []}
                    />
                )}
            </div>
        </div>
    );
}
