"use client";
import {
    Card,
    CardAction,
    CardContent,
    CardHeader,
} from "@/components/ui/card";
import { Group } from "../../types";
import { useEffect, useRef, useCallback, useState } from "react";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { SupabaseResponse } from "@/utils/supabase/types";

const FETCH_THROTTLING_LIMIT = 30000;

export default function GroupStatisticsChart<DataType>({
    group,
    chartTitle,
    fetchFunction,
    Chart,
}: {
    group: Group;
    chartTitle: string;
    fetchFunction: (groupId: string) => Promise<SupabaseResponse<DataType>>;
    Chart: React.ComponentType<{ data?: DataType[] | null; group: Group }>;
}) {
    const fetchTimestamp = useRef<null | Date>(null); // Track if fetch has already been called
    const [data, setData] = useState<SupabaseResponse<DataType> | undefined>();
    const [fetchState, setFetchState] = useState<null | "pending" | undefined>(
        null
    );
    const canFetch = () =>
        fetchTimestamp.current
            ? new Date().getTime() - fetchTimestamp.current?.getTime() >
              FETCH_THROTTLING_LIMIT
            : true;
    const getData = useCallback(async () => {
        setFetchState("pending");
        if (canFetch()) {
            fetchTimestamp.current = new Date();
            setData(await fetchFunction(group.id));
        }
        setFetchState(null);
    }, [group.id, fetchFunction]);

    useEffect(() => {
        if (!fetchTimestamp.current) {
            getData();
        }
    }, [getData]);

    return (
        <Card>
            <CardHeader>
                <p>{chartTitle}</p>
                <CardAction>
                    <Button type="button" onClick={() => getData()}>
                        <RefreshCcw
                            className={
                                fetchState === "pending" ? "animate-spin" : ""
                            }
                        />
                    </Button>
                </CardAction>
            </CardHeader>
            <CardContent>
                {fetchState ? (
                    <div className="min-h-[200px] flex items-center justify-center">
                        <LoadingSpinner />
                    </div>
                ) : (
                    <Chart data={data?.data} group={group} />
                )}
            </CardContent>
        </Card>
    );
}
