import { ComponentProps } from "react";
import { fetchPlannedFinanceStatistics } from "./fetch";
import PostgrestErrorDisplay from "../ui/postgrest-error-display";
import TripStatistic from "./trip-statistic";
import { getCurrentLocale } from "@/locales/server";
import { Constants } from "@/database.types";
import EstimateByCategory from "./charts/expenses-per-category";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../ui/card";

export default async function TripCostsSummary({
    tripId,
    className,
}: { tripId: string } & ComponentProps<"div">) {
    const [locale, { data, error }] = await Promise.all([
        getCurrentLocale(),
        fetchPlannedFinanceStatistics(tripId),
    ]);

    const plannedTotal =
        data?.financials.reduce(
            (acc, cur) => acc + cur.total_in_trip_currency,
            0,
        ) || 0;

    const confirmedParticipants =
        data?.participants.find(
            (bucket) =>
                bucket.status ===
                Constants.public.Enums.trip_participant_status[2],
        )?.count || 0;

    const potentialParticipants =
        data?.participants
            ?.filter(
                (bucket) =>
                    bucket.status !==
                    Constants.public.Enums.trip_participant_status[1],
            )
            .reduce((acc, cur) => acc + cur.count, 0) || 0;

    const committedTotal =
        data?.financials
            .filter(
                (item) =>
                    item.status ===
                        Constants.public.Enums.transaction_status[2] ||
                    item.status ===
                        Constants.public.Enums.transaction_status[3],
            )
            .reduce((acc, cur) => acc + cur.total_in_trip_currency, 0) || 0;
    const paidTotal =
        data?.financials
            .filter(
                (item) =>
                    item.status ===
                    Constants.public.Enums.transaction_status[3],
            )
            .reduce((acc, cur) => acc + cur.total_in_trip_currency, 0) || 0;

    return (
        <div className={className}>
            <PostgrestErrorDisplay error={error} />
            {data && data?.trip_currency && (
                <>
                    <TripStatistic
                        title="Planned Total"
                        value={Intl.NumberFormat(locale, {
                            style: "currency",
                            currency: data.trip_currency,
                        }).format(plannedTotal)}
                    />
                    <TripStatistic
                        title="Committed Total"
                        value={Intl.NumberFormat(locale, {
                            style: "currency",
                            currency: data.trip_currency,
                        }).format(committedTotal)}
                    />
                    <TripStatistic
                        title="Already Paid"
                        value={Intl.NumberFormat(locale, {
                            style: "currency",
                            currency: data.trip_currency,
                        }).format(paidTotal)}
                    />
                    <TripStatistic
                        title="Per Person AVG"
                        value={Intl.NumberFormat(locale, {
                            style: "currency",
                            currency: data.trip_currency,
                        }).format(plannedTotal / confirmedParticipants)}
                        description="Only Committed Participants"
                    />
                    <TripStatistic
                        title="Per Person AVG"
                        value={Intl.NumberFormat(locale, {
                            style: "currency",
                            currency: data.trip_currency,
                        }).format(plannedTotal / potentialParticipants)}
                        description="All Potential Participants"
                    />
                </>
            )}
            {data?.financials_by_category && (
                // <EstimateByCategory data={data.financials_by_category} />
                <Card className="col-span-full">
                    <CardHeader>
                        <CardTitle className="text-muted-foreground text-xs font-medium uppercase">
                            Planned costs per category
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-primary font-serif uppercase font-bold text-lg h-20 overflow-x-hidden text-ellipsis whitespace-nowrap w-full">
                        <EstimateByCategory
                            data={data.financials_by_category}
                        />
                    </CardContent>
                </Card>
                // <TripStatistic
                //     className="col-span-full"
                //     title="Planned spending per category"
                //     value={
                //         <EstimateByCategory
                //             data={data.financials_by_category}
                //         />
                //     }
                // />
            )}
        </div>
    );
}
