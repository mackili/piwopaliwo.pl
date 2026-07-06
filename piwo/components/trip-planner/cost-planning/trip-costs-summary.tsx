"use client";

import { ComponentProps } from "react";
import { TripPlannedFinanceStatisticsResponse } from "../fetch";
import TripStatistic from "../trip-statistic";
import { Constants } from "@/database.types";
import EstimateByCategory from "../charts/expenses-per-category";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrentLocale, useI18n } from "@/locales/client";

export default function TripCostsSummary({
    data,
    className,
}: {
    data: TripPlannedFinanceStatisticsResponse | null;
} & ComponentProps<"div">) {
    const locale = useCurrentLocale();
    const t = useI18n();
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
            {data && data?.trip_currency && (
                <>
                    <TripStatistic
                        title={t(
                            "TripPlanner.transactions.statistics.plannedTotal",
                        )}
                        value={Intl.NumberFormat(locale, {
                            style: "currency",
                            currency: data.trip_currency,
                        }).format(plannedTotal)}
                    />
                    <TripStatistic
                        title={t(
                            "TripPlanner.transactions.statistics.committedTotal",
                        )}
                        value={Intl.NumberFormat(locale, {
                            style: "currency",
                            currency: data.trip_currency,
                        }).format(committedTotal)}
                    />
                    <TripStatistic
                        title={t(
                            "TripPlanner.transactions.statistics.alreadyPaid",
                        )}
                        value={Intl.NumberFormat(locale, {
                            style: "currency",
                            currency: data.trip_currency,
                        }).format(paidTotal)}
                    />
                    <TripStatistic
                        title={t(
                            "TripPlanner.transactions.statistics.perPersonAvg",
                        )}
                        value={Intl.NumberFormat(locale, {
                            style: "currency",
                            currency: data.trip_currency,
                        }).format(plannedTotal / confirmedParticipants)}
                        description={t(
                            "TripPlanner.transactions.statistics.onlyCommittedParticipants",
                        )}
                    />
                    <TripStatistic
                        title={t(
                            "TripPlanner.transactions.statistics.perPersonAvg",
                        )}
                        value={Intl.NumberFormat(locale, {
                            style: "currency",
                            currency: data.trip_currency,
                        }).format(plannedTotal / potentialParticipants)}
                        description={t(
                            "TripPlanner.transactions.statistics.allPotentialParticipants",
                        )}
                    />
                </>
            )}
            {data?.financials_by_category && (
                <Card className="col-span-full">
                    <CardHeader>
                        <CardTitle className="text-muted-foreground text-xs font-medium uppercase">
                            {t(
                                "TripPlanner.transactions.statistics.plannedCostsPerCategory",
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-primary font-serif uppercase font-bold text-lg h-20 overflow-x-hidden text-ellipsis whitespace-nowrap w-full">
                        <EstimateByCategory
                            data={data.financials_by_category}
                        />
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
