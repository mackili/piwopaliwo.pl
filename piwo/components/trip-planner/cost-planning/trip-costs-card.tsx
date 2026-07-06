"use client";

import { ComponentProps, useContext, useState } from "react";
import { fetchTripTransactions } from "../fetch";
import { PostgrestError } from "@supabase/supabase-js";
import {
    Card,
    CardAction,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import PostgrestErrorDisplay from "@/components/ui/postgrest-error-display";
import TripTransaction from "./trip-transaction";
import { twMerge } from "tailwind-merge";
import {
    TripFinanceDataAction,
    TripFinanceDataActionType,
    TripPlannedTransactionsResult,
} from "../reducers";
import { TripContext } from "./trip-costs";
import { useI18n } from "@/locales/client";

export const INITIAL_TRANSACTIONS_LIMIT = 10 as const;

export default function TripCostsCard({
    tripId,
    mode = "planned",
    data,
    setTripFinanceData,
    className,
    ...props
}: {
    tripId: string;
    data: TripPlannedTransactionsResult;
    setTripFinanceData: (action: TripFinanceDataAction) => void;
    mode?: "planned" | "actual";
} & ComponentProps<"div">) {
    const t = useI18n();
    const [isLoading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<null | PostgrestError>(
        null,
    );
    const trip = useContext(TripContext);
    const enableFetchMore =
        data?.data && data?.count && data?.data?.length < data?.count;
    async function handleFetchMore() {
        console.log("fetching more");
        if (!tripId || !data?.data) return;
        setLoading(true);
        const { data: fetchedTransactions, error } =
            await fetchTripTransactions(
                tripId,
                INITIAL_TRANSACTIONS_LIMIT,
                data.data.length,
                { field: "created_at", ascending: true },
            );
        setErrorMessage(error);
        setTripFinanceData({
            type: TripFinanceDataActionType.APPEND_PLANNED,
            payload: fetchedTransactions || [],
        });
        setLoading(false);
        return;
    }
    return (
        <Card className={twMerge("pb-0", className)} {...props}>
            <CardHeader>
                <CardTitle>{t("TripPlanner.transactions.tripCosts")}</CardTitle>
                <CardAction>
                    <p>
                        {t("showingXofY", {
                            x: data?.data?.length || 0,
                            y: data?.count || 0,
                        })}
                    </p>
                </CardAction>
            </CardHeader>
            <CardContent className="space-y-4 px-0">
                <PostgrestErrorDisplay error={errorMessage} />
                {trip &&
                    data.data?.map((transaction) => (
                        <TripTransaction
                            key={transaction.id}
                            transaction={transaction}
                            trip={trip}
                            onSuccess={setTripFinanceData}
                            className="border-b pb-4 px-6 last:border-b-0 first:border-t first:pt-4"
                        />
                    ))}
            </CardContent>
            {!!enableFetchMore && (
                <CardFooter className="flex justify-center pb-6">
                    {isLoading ? (
                        <LoadingSpinner />
                    ) : (
                        <Button
                            variant="outline"
                            type="button"
                            onClick={handleFetchMore}
                        >
                            {t("fetchMore")}
                        </Button>
                    )}
                </CardFooter>
            )}
        </Card>
    );
}
