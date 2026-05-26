import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCurrentLocale } from "@/locales/server";
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
    params: Promise<{ tripSlug: string; tab: TRIP_PLANNER_TABS }>;
} & Readonly<{
    children: React.ReactNode;
}>) {
    const [{ tripSlug, tab }, locale] = await Promise.all([
        params,
        getCurrentLocale(),
    ]);
    const hrefFactory = (tab: TRIP_PLANNER_TABS) => {
        return `/${locale}/apps/trip-planner/${tripSlug}/${tab}`;
    };
    return (
        <Tabs value={tab} className="w-full">
            <TabsList
                variant="line"
                className="flex gap-4 w-full flex-wrap mb-4 justify-between"
            >
                <Link
                    href={hrefFactory(TRIP_PLANNER_TABS.OVERVIEW)}
                    scroll={false}
                    replace
                >
                    <TabsTrigger value="overview">
                        <HomeIcon />
                        Overview
                    </TabsTrigger>
                </Link>
                <Link
                    href={hrefFactory(TRIP_PLANNER_TABS.TIMELINE)}
                    scroll={false}
                    aria-disabled
                    replace
                >
                    <TabsTrigger value="timeline" disabled>
                        <CalendarIcon />
                        Timeline
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
                        Feed
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
                        Costs
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
                        Stay
                    </TabsTrigger>
                </Link>
                <Link
                    href={hrefFactory(TRIP_PLANNER_TABS.TRANSPORT)}
                    scroll={false}
                    replace
                >
                    <TabsTrigger value="transport">
                        <PlaneIcon />
                        Transport
                    </TabsTrigger>
                </Link>
                <Link
                    href={hrefFactory(TRIP_PLANNER_TABS.PARTICIPANTS)}
                    scroll={false}
                    replace
                >
                    <TabsTrigger value="participants">
                        <UsersRoundIcon />
                        Participants
                    </TabsTrigger>
                </Link>
            </TabsList>
            {children}
        </Tabs>
    );
}
