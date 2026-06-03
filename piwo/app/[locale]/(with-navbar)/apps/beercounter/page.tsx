import NewBeer from "@/components/beercounter/new-beer";
import { createClient } from "@/utils/supabase/server";
import BeerDashboard from "./beer-dashboard";
import { Suspense } from "react";
import BeerDashboardSuspense from "./beer-dashboard-suspense";

export default async function Page() {
    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();
    if (!data?.claims) {
        return <></>;
    }
    return (
        <div className="w-full flex flex-col items-center-safe gap-8 px-4 md:px-8">
            <div className="flex">
                <NewBeer user={data?.claims?.user_metadata} />
            </div>
            <Suspense fallback={<BeerDashboardSuspense />}>
                <BeerDashboard />
            </Suspense>
        </div>
    );
}
