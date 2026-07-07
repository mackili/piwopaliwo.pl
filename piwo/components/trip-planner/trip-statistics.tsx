import { Tables } from "@/database.types";
import TripStatistic from "./trip-statistic";
import { getFormattedDates } from "./trip-banner";
import { ParticipantResponseJson } from "./fetch";
import { getCurrentLocale } from "@/locales/server";
import { getTripLength } from "./reducers";

export async function TripStatistics({
    trip,
}: {
    trip: Tables<"v_trip_details">;
}) {
    const locale = await getCurrentLocale();
    return (
        <>
            {trip?.start_date && trip?.end_date && (
                <TripStatistic
                    title="Days"
                    value={getTripLength({
                        startdate: new Date(trip?.start_date) || "",
                        endDate: new Date(trip?.end_date || ""),
                    })}
                    description={getFormattedDates(
                        trip.start_date,
                        trip.end_date,
                        locale,
                    )}
                />
            )}
            {trip?.participants && (
                <TripStatistic
                    title="Going"
                    value={
                        (trip.participants as ParticipantResponseJson[]).filter(
                            (participant) => participant.status === "confirmed",
                        ).length
                    }
                    description={`${(trip.participants as ParticipantResponseJson[]).filter((participant) => participant.status === "invited" || participant.status === "tentative").length} pending`}
                />
            )}
            {/* <TripStatistic title="Spent" value="TBA" />
            <TripStatistic
                title="Next up"
                value="Train Warszawa - Giżycko"
                description="12 Jul · 08:30"
            /> */}
        </>
    );
}
