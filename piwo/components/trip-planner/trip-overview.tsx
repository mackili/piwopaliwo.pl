import { TripStatistics } from "./trip-statistics";
import { Tables } from "@/database.types";
import { ComponentProps } from "react";
import TripStatistic from "./trip-statistic";
import { getFormattedDates, getNumberOfDays } from "./trip-banner";
import { getCurrentLocale } from "@/locales/server";
import { ParticipantResponseJson } from "./fetch";
import TripParticipantsCard from "./participants-card";

export default async function TripOverview({
    trip,
    className,
    ...props
}: { trip: Tables<"v_trip_details"> } & ComponentProps<"div">) {
    const locale = await getCurrentLocale();
    return (
        <div className="grid grid-cols-12 w-full gap-8">
            {trip && (
                <>
                    <div className="grow-8 grid max-[350px]:grid-cols-1 grid-cols-2 md:grid-cols-4 gap-4 col-span-full lg:col-span-8">
                        <TripStatistics trip={trip} />
                    </div>
                    <div className="grow-4 gap-4 col-span-full lg:col-span-4">
                        <TripParticipantsCard trip={trip} />
                    </div>
                </>
            )}
        </div>
    );
}
