import { fetchTripDetails } from "@/components/trip-planner/fetch";
import { redirect } from "next/navigation";
import TripBanner from "@/components/trip-planner/trip-banner";
import { getCurrentLocale } from "@/locales/server";
export enum TRIP_PLANNER_TABS {
    OVERVIEW = "overview",
    TIMELINE = "timeline",
    FEED = "feed",
    COSTS = "costs",
    ACCOMMODATION = "accommodation",
    TRANSPORT = "transport",
    PARTICIPANTS = "participants",
}

export default async function Layout({
    children,
    params,
}: {
    params: Promise<{ tripId: string }>;
} & Readonly<{
    children: React.ReactNode;
}>) {
    const [{ tripId }, locale] = await Promise.all([
        params,
        getCurrentLocale(),
    ]);
    const [data] = await Promise.all([fetchTripDetails(tripId)]);
    const tripData = data.data;
    if (!tripData) {
        redirect(`/${locale}/apps/trip-planner`);
    }
    return (
        <div className="p-4 md:p-8 flex flex-col gap-8">
            {tripData && (
                <>
                    <TripBanner trip={tripData} className="col-span-full" />
                    {children}
                </>
            )}
        </div>
    );
}
