"use server";
import NewBeer from "@/components/beercounter/new-beer";
import { createClient } from "@/utils/supabase/server";
import BeerDashboard from "./beer-dashboard";
import { Suspense } from "react";
import BeerDashboardSuspense from "./beer-dashboard-suspense";

export default async function Page() {
    const supabase = await createClient();
    const user = await supabase.auth.getUser();
    if (!user?.data?.user) {
        return <></>;
    }
    return (
        <div className="w-full flex flex-col items-center-safe gap-8 px-4 md:px-8">
            <div className="flex">
                <NewBeer user={user.data.user} />
            </div>
            <Suspense fallback={<BeerDashboardSuspense />}>
                <BeerDashboard />
            </Suspense>
        </div>
    );
}
