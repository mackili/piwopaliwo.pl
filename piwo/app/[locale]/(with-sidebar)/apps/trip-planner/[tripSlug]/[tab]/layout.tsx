import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCurrentLocale, getI18n } from "@/locales/server";
import {
    ActivityIcon,
    BanknoteIcon,
    BedIcon,
    CalendarIcon,
    HomeIcon,
    PlaneIcon,
    UsersRoundIcon,
} from "lucide-react";
import Link from "next/link";

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
    params: Promise<{ tripSlug: string; tab: string }>;
} & Readonly<{
    children: React.ReactNode;
}>) {
    const [{ tripSlug, tab }, locale, t] = await Promise.all([
        params,
        getCurrentLocale(),
        getI18n(),
    ]);
    const hrefFactory = (tab: TRIP_PLANNER_TABS) => {
        return `/${locale}/apps/trip-planner/${tripSlug}/${tab}`;
    };
    return (
        <Tabs value={tab} className="w-full ">
            <TabsList
                variant="line"
                className="flex gap-4 w-full flex-nowrap mb-4 justify-between overflow-x-scroll overflow-y-hidden"
            >
                <Link
                    href={hrefFactory(TRIP_PLANNER_TABS.OVERVIEW)}
                    scroll={false}
                    replace
                >
                    <TabsTrigger value="overview">
                        <HomeIcon />
                        {t("TripPlanner.tabs.overview")}
                    </TabsTrigger>
                </Link>
                <Link
                    href={hrefFactory(TRIP_PLANNER_TABS.TIMELINE)}
                    scroll={false}
                    replace
                >
                    <TabsTrigger value="timeline">
                        <CalendarIcon />
                        {t("TripPlanner.tabs.timeline")}
                    </TabsTrigger>
                </Link>
                <Link
                    href={hrefFactory(TRIP_PLANNER_TABS.FEED)}
                    scroll={false}
                    aria-disabled
                    replace
                >
                    <TabsTrigger value="feed" disabled>
                        <ActivityIcon />
                        {t("TripPlanner.tabs.feed")}
                    </TabsTrigger>
                </Link>
                <Link
                    href={hrefFactory(TRIP_PLANNER_TABS.COSTS)}
                    scroll={false}
                    aria-disabled
                    replace
                >
                    <TabsTrigger value="costs">
                        <BanknoteIcon />
                        {t("TripPlanner.tabs.costs")}
                    </TabsTrigger>
                </Link>
                <Link
                    href={hrefFactory(TRIP_PLANNER_TABS.ACCOMMODATION)}
                    scroll={false}
                    aria-disabled
                    replace
                >
                    <TabsTrigger value="accommodation">
                        <BedIcon />
                        {t("TripPlanner.tabs.stay")}
                    </TabsTrigger>
                </Link>
                <Link
                    href={hrefFactory(TRIP_PLANNER_TABS.TRANSPORT)}
                    scroll={false}
                    replace
                >
                    <TabsTrigger value="transport">
                        <PlaneIcon />
                        {t("TripPlanner.tabs.transport")}
                    </TabsTrigger>
                </Link>
                <Link
                    href={hrefFactory(TRIP_PLANNER_TABS.PARTICIPANTS)}
                    scroll={false}
                    replace
                >
                    <TabsTrigger value="participants">
                        <UsersRoundIcon />
                        {t("TripPlanner.tabs.participants")}
                    </TabsTrigger>
                </Link>
            </TabsList>
            {children}
        </Tabs>
    );
}
