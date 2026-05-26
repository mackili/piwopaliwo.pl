import { getCurrentLocale } from "@/locales/server";
import { redirect } from "next/navigation";
import { TRIP_PLANNER_TABS } from "./[tab]/page";

export default async function Page({
    params,
}: {
    params: Promise<{ tripSlug: string }>;
}) {
    const [{ tripSlug }, locale] = await Promise.all([
        params,
        getCurrentLocale(),
    ]);
    redirect(
        `/${locale}/apps/trip-planner/${tripSlug}/${TRIP_PLANNER_TABS.OVERVIEW}`,
    );
}
