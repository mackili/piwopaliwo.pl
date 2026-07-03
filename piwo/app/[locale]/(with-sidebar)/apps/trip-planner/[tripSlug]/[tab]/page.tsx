import { fetchTripDetails } from "@/components/trip-planner/fetch";
import TripOverview from "@/components/trip-planner/trip-overview";
import { redirect } from "next/navigation";
import TripParticipantsCard from "@/components/trip-planner/participant-management/participants-card";
import TripCosts from "@/components/trip-planner/cost-planning/trip-costs";
import { getCurrentLocale } from "@/locales/server";
import TripAccommodationOverview from "@/components/trip-planner/accommodation/accommodation-overview";
import TransportOverview from "@/components/trip-planner/transport/transport-overview";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import TripTimeline from "@/components/trip-planner/timeline/trip-timeline";

export enum TRIP_PLANNER_TABS {
    OVERVIEW = "overview",
    TIMELINE = "timeline",
    FEED = "feed",
    COSTS = "costs",
    ACCOMMODATION = "accommodation",
    TRANSPORT = "transport",
    PARTICIPANTS = "participants",
}

export default async function Page({
    params,
}: {
    params: Promise<{ tripSlug: string; tab: string }>;
}) {
    const [{ tripSlug, tab }, locale] = await Promise.all([
        params,
        getCurrentLocale(),
    ]);
    const [{ data: tripData }] = await Promise.all([
        fetchTripDetails({ tripSlug: tripSlug }),
    ]);
    if (!tripData) {
        redirect(`/${locale}/apps/trip-planner`);
    }
    let Result = <div></div>;
    switch (tab) {
        case TRIP_PLANNER_TABS.OVERVIEW:
            Result = <TripOverview trip={tripData} />;
            break;
        case TRIP_PLANNER_TABS.ACCOMMODATION:
            Result = <TripAccommodationOverview tripId={tripData.id || ""} />;
            break;
        case TRIP_PLANNER_TABS.COSTS:
            Result = <TripCosts trip={tripData} />;
            break;
        case TRIP_PLANNER_TABS.PARTICIPANTS:
            Result = (
                <TripParticipantsCard trip={tripData} variant="expanded" />
            );
            break;
        case TRIP_PLANNER_TABS.TRANSPORT:
            Result = <TransportOverview tripId={tripData.id || ""} />;
            break;
        case TRIP_PLANNER_TABS.TIMELINE:
            Result = <TripTimeline tripId={tripData.id || ""} />;
            break;
        default:
            Result = (
                <div>
                    <h2>Coming up!</h2>
                </div>
            );
            break;
    }
    return (
        <Suspense
            fallback={
                <div className="space-y-4">
                    <div className="w-full space-y-2">
                        <Skeleton className="w-64 h-8" />
                        <Skeleton className="w-96 h-6" />
                    </div>
                    <div className="space-y-4">
                        <Skeleton className="w-full h-256"></Skeleton>
                    </div>
                </div>
            }
        >
            {Result}
        </Suspense>
    );
}
