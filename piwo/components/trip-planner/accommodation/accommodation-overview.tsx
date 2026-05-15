import PostgrestErrorDisplay from "@/components/ui/postgrest-error-display";
import { getCurrentLocale } from "@/locales/server";
import { fetchTripAccommodationSummary } from "../fetch";
import TripAccommodationCard from "./accommodation-card";

export default async function TripAccomodationOverview({
    tripId,
}: {
    tripId: string;
}) {
    const [locale, { data, error }] = await Promise.all([
        getCurrentLocale(),
        fetchTripAccommodationSummary(tripId),
    ]);
    console.log(data);
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
                {data?.map((accommodation, index) => (
                    <TripAccommodationCard
                        key={index}
                        accommodation={accommodation}
                    />
                ))}
            </div>
        </div>
    );
}
