// import { fetchArticle } from "@/app/[locale]/(with-navbar)/blog/read/[article]/fetch";
import { fetchTripDetails } from "@/components/trip-planner/fetch";
import TripParticipantsCard from "@/components/trip-planner/participants-card";
import TripBanner from "@/components/trip-planner/trip-banner";
import TripOverview from "@/components/trip-planner/trip-overview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCurrentLocale } from "@/locales/server";
import { createClient } from "@/utils/supabase/server";
// import { getCurrentLocale } from "@/locales/server";
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
        <div className="p-2 flex flex-col gap-8">
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
                            <TabsTrigger value="participants">
                                <UsersRoundIcon />
                                Participants
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="overview">
                            <TripOverview trip={tripData} />
                        </TabsContent>
                        <TabsContent value="participants">
                            <TripParticipantsCard
                                trip={tripData}
                                variant="expanded"
                            />
                        </TabsContent>
                    </Tabs>
                </>
            )}
        </div>
    );
}
