"use client";

import TripCostsCard from "./trip-costs-card";
import TripCostsSummary from "./trip-costs-summary";
import { TripPlannedFinanceStatisticsResponse } from "../fetch";
import { createContext } from "react";
import { Tables } from "@/database.types";

export default function TripCostsDisplay({
    trip,
    tripFinancialStatistics,
}: {
    trip: Tables<"v_trip_details">;
    tripFinancialStatistics?: TripPlannedFinanceStatisticsResponse | null;
}) {
    return (
        <TripContext value={trip}>
            {tripFinancialStatistics && (
                <TripCostsSummary
                    data={tripFinancialStatistics}
                    className="col-span-full @max-[370px]:grid-cols-1 grid-cols-2 @lg:grid-cols-3 grid gap-4"
                />
            )}
            {trip?.id && (
                <TripCostsCard tripId={trip.id} className="col-span-full" />
            )}
        </TripContext>
    );
}
