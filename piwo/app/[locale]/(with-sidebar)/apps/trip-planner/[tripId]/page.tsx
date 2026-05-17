import { getCurrentLocale } from "@/locales/server";
import { redirect } from "next/navigation";
import { TRIP_PLANNER_TABS } from "./[tab]/page";

export default async function Page({
    params,
}: {
    params: Promise<{ tripId: string }>;
}) {
    const [{ tripId }, locale] = await Promise.all([
        params,
        getCurrentLocale(),
    ]);
    redirect(
        `/${locale}/apps/trip-planner/${tripId}/${TRIP_PLANNER_TABS.OVERVIEW}`,
    );
}
