"use client";
import {
    Card,
    CardAction,
    CardContent,
    CardHeader,
} from "@/components/ui/card";
import { Group, GroupBalance, GroupCurrency, GroupMember } from "../../types";
import { ComponentProps } from "react";
import PostgrestErrorDisplay from "@/components/ui/postgrest-error-display";
import { Badge } from "@/components/ui/badge";
import { SupabaseResponse } from "@/utils/supabase/types";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import AllReceivables from "./receivables-all";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OptimizedReceivables from "./receivables-optimized";

export default function GroupReceivablesCard({
    balancesResponse,
    currenciesResponse,
    // group,
    groupMembers,
    ...props
}: {
    group: Group;
    groupMembers: GroupMember[];
    balancesResponse: SupabaseResponse<GroupBalance>;
    currenciesResponse: PostgrestSingleResponse<Group>;
} & ComponentProps<"div">) {
    const { data: balances, error: balancesError } = balancesResponse;
    const currenciesData = (currenciesResponse.data?.currencies ||
        []) as GroupCurrency[];
    return (
        <Card {...props}>
            <Tabs defaultValue="optimized">
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
                            <TabsTrigger value="optimized">
                                Optimized
                            </TabsTrigger>
                            <TabsTrigger value="all">All</TabsTrigger>
                        </TabsList>
                    </CardAction>
                </CardHeader>
                <CardContent className="max-h-[400px] overflow-scroll">
                    <TabsContent
                        value="all"
                        className="overflow-scroll flex flex-col gap-4"
                    >
                        <AllReceivables
                            balances={balances}
                            currencies={currenciesData}
                        />
                    </TabsContent>
                    <TabsContent
                        value="optimized"
                        className="overflow-scroll flex flex-col gap-4"
                    >
                        <OptimizedReceivables
                            balances={balances}
                            currencies={currenciesData}
                            groupMembers={groupMembers || []}
                        />
                    </TabsContent>
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
