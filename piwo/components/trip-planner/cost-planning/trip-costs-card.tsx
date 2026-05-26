"use client";

import { Tables } from "@/database.types";
import { ComponentProps, useEffect, useReducer, useRef, useState } from "react";
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

export const INITIAL_TRANSACTIONS_LIMIT = 10 as const;

enum TransactionFetchActionType {
    FETCH = "FETCH",
    APPEND = "APPEND",
}

interface TransactionFetchAction {
    type: TransactionFetchActionType;
    payload: Tables<"trip_transaction">[];
}

function tripTransactionsReducer(
    state: Tables<"trip_transaction">[],
    action: TransactionFetchAction,
) {
    let result = state;
    switch (action.type) {
        case TransactionFetchActionType.APPEND:
            result = [...state, ...action.payload];
            break;
        case TransactionFetchActionType.FETCH:
            result = action.payload;
            break;
        default:
            break;
    }
    return result;
}

export default function TripCostsCard({
    trip,
    mode = "planned",
    className,
    ...props
}: {
    trip: Tables<"v_trip_details">;
    mode?: "planned" | "actual";
} & ComponentProps<"div">) {
    const [isLoading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<null | PostgrestError>(
        null,
    );
    const [tripLineItems, setTripLineItems] = useReducer(
        tripTransactionsReducer,
        [],
    );
    const totalTransactionsCount = useRef<number | null>(null);
    useEffect(() => {
        const handleLineItemsFetch = async () => {
            if (!trip?.id) return;
            setLoading(true);
            const { count, data, error } = await fetchTripTransactions(
                trip.id,
                INITIAL_TRANSACTIONS_LIMIT,
                0,
                { field: "created_at", ascending: true },
            );
            setErrorMessage(error);
            totalTransactionsCount.current = count;
            setTripLineItems({
                type: TransactionFetchActionType.FETCH,
                payload: data || [],
            });
            setLoading(false);
        };
        handleLineItemsFetch();
    }, [trip?.id, mode]);
    const enableFetchMore = totalTransactionsCount.current
        ? tripLineItems.length < totalTransactionsCount.current
        : false;

    async function handleFetchMore() {
        if (!trip?.id) return;
        setLoading(true);
        const { data, error } = await fetchTripTransactions(
            trip.id,
            INITIAL_TRANSACTIONS_LIMIT,
            tripLineItems.length,
            { field: "created_at", ascending: true },
        );
        setErrorMessage(error);
        setTripLineItems({
            type: TransactionFetchActionType.APPEND,
            payload: data || [],
        });
        setLoading(false);
    }
    return (
        <Card className={twMerge("pb-0", className)} {...props}>
            <CardHeader>
                <CardTitle>Trip Costs</CardTitle>
                <CardAction>
                    <p>
                        Showing {tripLineItems.length} of{" "}
                        {totalTransactionsCount.current} costs
                    </p>
                </CardAction>
            </CardHeader>
            <CardContent className="space-y-4 px-0">
                <PostgrestErrorDisplay error={errorMessage} />
                {tripLineItems.map((transaction) => (
                    <TripTransaction
                        key={transaction.id}
                        transaction={transaction}
                        trip={trip}
                        className="border-b pb-4 px-6 last:border-b-0 first:border-t first:pt-4"
                    />
                ))}
            </CardContent>
            {enableFetchMore && (
                <CardFooter className="flex justify-center pb-6">
                    {isLoading ? (
                        <LoadingSpinner />
                    ) : (
                        <Button
                            variant="outline"
                            type="button"
                            onClick={handleFetchMore}
                        >
                            Fetch More
                        </Button>
                    )}
                </CardFooter>
            )}
        </Card>
    );
}
