import { CardDefinition } from "./dashboard-cards";
import { v4 as uuid } from "uuid";
import { createClient } from "@/utils/supabase/server";
import BeerDashboardCard from "./beer-dashboard-card";
import BeerDashboardCardSuspense from "./beer-dashboard-card-suspense";
import { Suspense } from "react";
import { ConsumedDrinkSchema } from "@/components/beercounter/types";
import * as z from "zod";
import BeerHeatmap from "./beer-heatmap";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const cardDefinitions: CardDefinition[] = [
    {
        id: uuid(),
        name: "totalBeers",
        label: "Total Beers Drank",
        footer: "Number of total beers logged by you in the system",
        valueSelector: "return data?.length",
    },
    {
        id: uuid(),
        name: "beersThisMonth",
        label: "Beers drank this month",
        badgeSelector:
            "return `Last Month: ${data?.filter((beer) => new Date(beer.drank_at).getYear() === new Date(new Date().setDate(0)).getYear() && new Date(beer.drank_at).getMonth() === new Date(new Date().setDate(0)).getMonth())?.length}`",
        footer: "Number of beers logged by you this month",
        valueSelector:
            "return data?.filter((beer) => new Date(beer.drank_at).getYear() === new Date().getYear() && new Date(beer.drank_at).getMonth() === new Date().getMonth())?.length",
    },
    {
        id: uuid(),
        name: "beerRank",
        label: "Your Beer Rank",
        footer: "How many beers have you drank compared to the others",
        valueSelector: "return 'TOP'",
    },
];

export default async function BeerDashboard() {
    const supabase = await createClient();
    const user = await supabase.auth.getUser();
    if (!user?.data?.user) {
        return <></>;
    }
    const { data, error } = await supabase
        .from("consumed_drink")
        .select("id,created_at,drank_at,drink_type,quantity,user_id")
        .filter("user_id", "eq", user.data.user.id);
    const parsed =
        data && (await z.array(ConsumedDrinkSchema).safeParseAsync(data));
    if (!parsed || !parsed.success) {
        return (
            <p className="text-red-700">
                {parsed?.error.message || error?.message}
            </p>
        );
    }
    return (
        <div className="w-full h-full grid grid-cols-2 md:grid-cols-3 gap-4">
            {(cardDefinitions || []).map((definition, index) => (
                <Suspense key={index} fallback={<BeerDashboardCardSuspense />}>
                    <BeerDashboardCard
                        cardDefinition={definition}
                        data={parsed.data}
                    />
                </Suspense>
            ))}
            <div className="flex justify-center w-full col-span-full">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-3xl font-semibold tabular-nums @[250px]/card:text-4xl font-serif">
                            Heatmap
                        </CardTitle>
                    </CardHeader>
                    <Suspense>
                        <BeerHeatmap data={data} />
                    </Suspense>
                    <CardFooter>
                        {`How many beers did you drink each day. It's all about consistency.`}
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
