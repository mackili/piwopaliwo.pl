"use client";
import {
    ComponentProps,
    createContext,
    useEffect,
    useReducer,
    useState,
} from "react";
import { twMerge } from "tailwind-merge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BanknoteIcon, PiggyBankIcon } from "lucide-react";
import TripTransactionEdit from "./edit-transaction";
import { Tables } from "@/database.types";
import { fetchPlannedFinanceStatistics, fetchTripTransactions } from "../fetch";
import TripCostsSummary, {
    TripBudgetByCategoryChart,
} from "./trip-costs-summary";
import TripCostsCard, { INITIAL_TRANSACTIONS_LIMIT } from "./trip-costs-card";
import { TripFinanceDataActionType, tripFinanceDataReducer } from "../reducers";
import TripCostsCardSkeleton from "./trip-costs-card-skeleton";
import TripCostsSummarySkeleton from "./trip-costs-summary-skeleton";
import { useI18n } from "@/locales/client";

export const TripContext = createContext<Tables<"v_trip_details"> | null>(null);

export default function TripCosts({
    trip,
    className,
    ...props
}: { trip: Tables<"v_trip_details"> } & ComponentProps<"div">) {
    const tripId = trip?.id;
    const t = useI18n();
    const [selectedTab, setSelectedTab] = useState<"planning" | "spending">(
        "planning",
    );
    const [data, setData] = useReducer(tripFinanceDataReducer, {
        planned: {
            statistics: { data: null, error: null, isLoading: true },
            transactions: {
                data: null,
                error: null,
                count: null,
                isLoading: true,
            },
        },
    });
    useEffect(() => {
        const handleFetch = async () => {
            if (!tripId) return;
            const [financialStatisticsResult, tripTransactionsResult] =
                await Promise.all([
                    fetchPlannedFinanceStatistics(tripId),
                    fetchTripTransactions(
                        tripId,
                        INITIAL_TRANSACTIONS_LIMIT,
                        0,
                        { field: "created_at", ascending: true },
                    ),
                ]);
            setData({
                type: TripFinanceDataActionType.FETCH_PLANNED_STATISTICS,
                payload: { ...financialStatisticsResult, isLoading: false },
            });
            setData({
                type: TripFinanceDataActionType.FETCH_PLANNED,
                payload: { ...tripTransactionsResult, isLoading: false },
            });
        };
        handleFetch();
    }, [tripId]);
    return (
        <div>
            <TripContext value={trip}>
                <Tabs value={selectedTab} className="gap-4">
                    <div className="flex flex-row flex-wrap justify-between gap-4">
                        <div className="space-y-2">
                            <p className="font-serif text-2xl font-bold">
                                {t("TripPlanner.tabs.costs")}
                            </p>
                            <p className="text-muted-foreground text-sm">
                                {t("TripPlanner.transactions.tabDescription")}
                            </p>
                        </div>
                        <div className="flex flex-row flex-wrap gap-4">
                            <TabsList variant="line">
                                <TabsTrigger
                                    value="planning"
                                    onClick={() => setSelectedTab("planning")}
                                >
                                    <PiggyBankIcon />
                                    {t("TripPlanner.transactions.planning")}
                                </TabsTrigger>
                                <TabsTrigger
                                    disabled
                                    value="spending"
                                    onClick={() => setSelectedTab("spending")}
                                >
                                    <BanknoteIcon />
                                    {t("TripPlanner.transactions.spending")}
                                </TabsTrigger>
                            </TabsList>
                            <TripTransactionEdit
                                trip={trip}
                                onSuccess={setData}
                            />
                        </div>
                    </div>
                    <div
                        className={twMerge(
                            "grid grid-cols-12 w-full gap-4",
                            className,
                        )}
                        {...props}
                    >
                        {trip?.id && (
                            <>
                                <TabsContent
                                    value="planning"
                                    className="grow-8 col-span-full lg:col-span-8"
                                >
                                    <div className="grid max-[350px]:grid-cols-1 grid-cols-2 md:grid-cols-4 gap-4 @container">
                                        {data.planned.statistics.isLoading ? (
                                            <TripCostsCardSkeleton />
                                        ) : (
                                            data?.planned?.statistics?.data
                                                ?.financials_by_category && (
                                                <TripBudgetByCategoryChart
                                                    data={
                                                        data.planned.statistics
                                                            .data
                                                            .financials_by_category
                                                    }
                                                />
                                            )
                                        )}
                                        {data.planned.transactions.isLoading ? (
                                            <TripCostsCardSkeleton />
                                        ) : (
                                            <TripCostsCard
                                                tripId={trip.id}
                                                data={data.planned.transactions}
                                                setTripFinanceData={setData}
                                                className="col-span-full"
                                            />
                                        )}
                                    </div>
                                </TabsContent>
                                <TabsContent
                                    value="spending"
                                    className="grow-8 col-span-full lg:col-span-8"
                                ></TabsContent>
                                <TabsContent
                                    value="planning"
                                    className="grow-4 gap-4 col-span-full lg:col-span-4 @container"
                                >
                                    <div>
                                        {data.planned.statistics.isLoading ? (
                                            <TripCostsSummarySkeleton />
                                        ) : (
                                            <TripCostsSummary
                                                data={
                                                    data.planned.statistics.data
                                                }
                                                className="col-span-full @max-[370px]:grid-cols-1 grid-cols-2 @lg:grid-cols-3 grid gap-4"
                                            />
                                        )}
                                    </div>
                                </TabsContent>
                                <TabsContent
                                    value="spending"
                                    className="grow-4 gap-4 col-span-full lg:col-span-4 @container"
                                >
                                    <div>
                                        {data.planned.statistics.isLoading ? (
                                            <TripCostsSummarySkeleton />
                                        ) : (
                                            <TripCostsSummary
                                                data={
                                                    data.planned.statistics.data
                                                }
                                                className="col-span-full @max-[370px]:grid-cols-1 grid-cols-2 @lg:grid-cols-3 grid gap-4"
                                            />
                                        )}
                                    </div>
                                </TabsContent>
                            </>
                        )}
                    </div>
                </Tabs>
            </TripContext>
        </div>
    );
}
