import { TripStatistics } from "./trip-statistics";
import { Tables } from "@/database.types";
import { ComponentProps } from "react";
import TripParticipantsCard from "./participant-management/participants-card";
import { twMerge } from "tailwind-merge";

export default function TripOverview({
    trip,
    className,
    ...props
}: { trip: Tables<"v_trip_details"> } & ComponentProps<"div">) {
    return (
        <div
            className={twMerge("grid grid-cols-12 w-full gap-4", className)}
            {...props}
        >
            {trip && (
                <>
                    <div className="grow-8 col-span-full lg:col-span-8">
                        <div className="grid max-[350px]:grid-cols-1 grid-cols-2 md:grid-cols-4 gap-4">
                            <TripStatistics trip={trip} />
                        </div>
                    </div>
                    <div className="grow-4 gap-4 col-span-full lg:col-span-4">
                        <div>
                            <TripParticipantsCard trip={trip} />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
