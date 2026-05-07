// import { fetchArticle } from "@/app/[locale]/(with-navbar)/blog/read/[article]/fetch";
import { fetchTripDetails } from "@/components/trip-planner/fetch";
import TripBanner from "@/components/trip-planner/trip-banner";
import TripOverview from "@/components/trip-planner/trip-overview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { getCurrentLocale } from "@/locales/server";
import {
    ActivityIcon,
    BanknoteIcon,
    BedIcon,
    CalendarIcon,
    HomeIcon,
    PlaneIcon,
} from "lucide-react";

export default async function Page({
    params,
}: {
    params: Promise<{ tripId: string }>;
}) {
    const { tripId } = await params;
    const data = await fetchTripDetails(tripId);
    const tripData = data.data;
    return (
        <div className="p-2 flex flex-col gap-8">
            {tripData && (
                <>
                    <TripBanner trip={tripData} className="col-span-full" />
                    <Tabs defaultValue="overview" className="w-full">
                        <TabsList
                            variant="line"
                            className="inline-flex gap-4 w-full flex-wrap mb-4"
                        >
                            <TabsTrigger value="overview">
                                <HomeIcon />
                                Overview
                            </TabsTrigger>
                            <TabsTrigger value="timeline" disabled>
                                <CalendarIcon />
                                Timeline
                            </TabsTrigger>
                            <TabsTrigger value="feed" disabled>
                                <ActivityIcon />
                                Feed
                            </TabsTrigger>
                            <TabsTrigger value="costs" disabled>
                                <BanknoteIcon />
                                Costs
                            </TabsTrigger>
                            <TabsTrigger value="stay" disabled>
                                <BedIcon />
                                Stay
                            </TabsTrigger>
                            <TabsTrigger value="transport" disabled>
                                <PlaneIcon />
                                Transport
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="overview">
                            <TripOverview trip={tripData} />
                        </TabsContent>
                    </Tabs>
                </>
            )}
        </div>
    );
}
