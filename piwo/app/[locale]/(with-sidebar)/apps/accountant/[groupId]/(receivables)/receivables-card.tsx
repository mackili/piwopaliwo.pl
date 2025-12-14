"use client";
import {
    Card,
    CardAction,
    CardContent,
    CardHeader,
} from "@/components/ui/card";
import {
    Group,
    GroupBalance,
    GroupCurrency,
    TotalSpentObject,
} from "../../types";
import { ComponentProps } from "react";
import PostgrestErrorDisplay from "@/components/ui/postgrest-error-display";
import UserRow from "@/components/ui/user-row";
import { memberName } from "../members-table";
import { calculateGrandTotal } from "../grand-totals-client";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SupabaseResponse } from "@/utils/supabase/types";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import AllReceivables from "./receivables-all";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function GroupReceivablesCard({
    balancesResponse,
    currenciesResponse,
    ...props
}: {
    group: Group;
    balancesResponse: SupabaseResponse<GroupBalance>;
    currenciesResponse: PostgrestSingleResponse<Group>;
} & ComponentProps<"div">) {
    const { data: balances, error: balancesError } = balancesResponse;
    const currenciesData = (currenciesResponse.data?.currencies ||
        []) as GroupCurrency[];
    // const getTotalSpentObjects: () => Record<
    //     number,
    //     TotalSpentObject[]
    // > = () => {
    //     const result: Record<number, TotalSpentObject[]> = {};
    //     (balances || []).forEach((balance, index) => {
    //         result[index] = Object.keys(balance.currency_balance).map(
    //             (key) => ({
    //                 iso: key,
    //                 amount: balance.currency_balance[key],
    //             })
    //         );
    //     });
    //     return result;
    // };
    // const totalSpentObjects = getTotalSpentObjects();
    return (
        <Card {...props}>
            <Tabs defaultValue="all">
                <CardHeader>
                    <div className="flex flex-row gap-2">
                        <h4>Receivables</h4>
                        <p className="flex items-center">
                            <Badge variant="outline" className="aspect-square">
                                {balances?.length || 0}
                            </Badge>
                        </p>
                    </div>
                    <CardAction>
                        <TabsList>
                            <TabsTrigger value="all">All</TabsTrigger>
                            <TabsTrigger value="optimized">
                                Optimized
                            </TabsTrigger>
                        </TabsList>
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <TabsContent
                        value="all"
                        className="overflow-scroll flex flex-col gap-4"
                    >
                        <AllReceivables
                            balances={balances}
                            currencies={currenciesData}
                        />
                    </TabsContent>
                    <TabsContent value="optimized"></TabsContent>
                    {(balancesError || currenciesResponse?.error) && (
                        <PostgrestErrorDisplay
                            error={balancesError || currenciesResponse?.error}
                        />
                    )}
                </CardContent>
            </Tabs>
        </Card>
    );
}
