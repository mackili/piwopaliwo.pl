import TripBanner from "@/components/trip-planner/trip-banner";
import TripBannerSuspense from "@/components/trip-planner/trip-banner-suspense";
import { Suspense } from "react";
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
    params: Promise<{ tripSlug: string }>;
} & Readonly<{
    children: React.ReactNode;
}>) {
    const [{ tripSlug }] = await Promise.all([params]);
    return (
        <div className="p-4 md:p-8 flex flex-col gap-8">
            {tripSlug && (
                <>
                    <Suspense fallback={<TripBannerSuspense />}>
                        <TripBanner
                            tripSlug={tripSlug}
                            className="col-span-full"
                        />
                    </Suspense>
                    {children}
                </>
            )}
        </div>
    );
}
