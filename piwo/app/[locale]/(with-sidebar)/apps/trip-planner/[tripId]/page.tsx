import { fetchTripDetails } from "@/components/trip-planner/fetch";
import TripParticipantsCard from "@/components/trip-planner/participant-management/participants-card";
import TripBanner from "@/components/trip-planner/trip-banner";
import TripCosts from "@/components/trip-planner/cost-planning/trip-costs";
import TripOverview from "@/components/trip-planner/trip-overview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCurrentLocale } from "@/locales/server";
import { createClient } from "@/utils/supabase/server";
import {
    ActivityIcon,
    BanknoteIcon,
    BedIcon,
    CalendarIcon,
    HomeIcon,
    PlaneIcon,
    UsersRoundIcon,
} from "lucide-react";
import { redirect } from "next/navigation";
import TripAccommodationOverview from "@/components/trip-planner/accommodation/accommodation-overview";
import TransportOverview from "@/components/trip-planner/transport/transport-overview";

export default async function Page({
    params,
    searchParams,
}: {
    params: Promise<{ tripId: string }>;
    searchParams: Promise<{ selectedTab: string | string[] | undefined }>;
}) {
    const [supabase, { tripId }, locale, { selectedTab }] = await Promise.all([
        createClient(),
        params,
        getCurrentLocale(),
        searchParams,
    ]);
    const [
        data,
        {
            data: { user },
        },
    ] = await Promise.all([fetchTripDetails(tripId), supabase.auth.getUser()]);
    const tripData = data.data;
    if (
        !user ||
        !tripData ||
        !tripData?.participants
            .map((participant) => participant.user?.id)
            .includes(user.id)
    ) {
        redirect(`/${locale}/apps/trip-planner`);
    }
    return (
        <div className="p-4 md:p-8 flex flex-col gap-8">
            {tripData && (
                <>
                    <TripBanner trip={tripData} className="col-span-full" />
                    <Tabs
                        defaultValue={
                            Array.isArray(selectedTab)
                                ? selectedTab[0]
                                : selectedTab || "overview"
                        }
                        className="w-full"
                    >
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
                            <TabsTrigger value="costs">
                                <BanknoteIcon />
                                Costs
                            </TabsTrigger>
                            <TabsTrigger value="accommodation">
                                <BedIcon />
                                Stay
                            </TabsTrigger>
                            <TabsTrigger value="transport">
                                <PlaneIcon />
                                Transport
                            </TabsTrigger>
                            <TabsTrigger value="participants">
                                <UsersRoundIcon />
                                Participants
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="overview">
                            <TripOverview trip={tripData} />
                        </TabsContent>
                        <TabsContent value="costs">
                            {tripData && <TripCosts trip={tripData} />}
                        </TabsContent>
                        <TabsContent value="participants">
                            <TripParticipantsCard
                                trip={tripData}
                                variant="expanded"
                            />
                        </TabsContent>
                        <TabsContent value="accommodation">
                            <TripAccommodationOverview tripId={tripId} />
                        </TabsContent>
                        <TabsContent value="transport">
                            <TransportOverview tripId={tripId} />
                        </TabsContent>
                    </Tabs>
                </>
            )}
        </div>
    );
}
