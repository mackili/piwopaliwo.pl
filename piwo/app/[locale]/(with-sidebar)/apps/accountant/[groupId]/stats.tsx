import {
    Card,
    CardAction,
    CardContent,
    CardHeader,
} from "@/components/ui/card";
import { Group } from "../types";
import { ComponentProps } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GroupStatisticsChart from "./(statistics)/stat-chart-display";
import {
    fetchDailyTransactionSummaries,
    fetchGroupMemberBalances,
} from "./(statistics)/fetch";
import MemberBalanceChart from "./(statistics)/member-balance-chart";
import AggregateMemberBalanceChart from "./(statistics)/aggregated-member-balance-chart";
import TransactionsInTimeChart from "./(statistics)/transactions-in-time-chart";

export default function GroupStatistics({
    group,
    ...props
}: { group: Group } & ComponentProps<"div">) {
    return (
        <Card {...props}>
            <Tabs defaultValue="member-balance-currency">
                <CardHeader>
                    <h4>{`${group.name}'s`} Statistics</h4>
                    <CardAction className="@max-sm:col-span-full @max-sm:row-start-2 @max-sm:overflow-x-scroll w-full">
                        <TabsList>
                            <TabsTrigger value="member-balance-currency">
                                Balance per currency
                            </TabsTrigger>
                            <TabsTrigger value="member-balance">
                                Aggregate balance
                            </TabsTrigger>
                            <TabsTrigger value="daily-transactions">
                                Daily transactions
                            </TabsTrigger>
                        </TabsList>
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <TabsContent value="member-balance-currency">
                        <GroupStatisticsChart
                            group={group}
                            chartTitle="Member Balances"
                            fetchFunction={fetchGroupMemberBalances}
                            Chart={MemberBalanceChart}
                        />
                    </TabsContent>
                    <TabsContent value="member-balance">
                        <GroupStatisticsChart
                            group={group}
                            chartTitle="Aggregate Member Balances"
                            fetchFunction={fetchGroupMemberBalances}
                            Chart={AggregateMemberBalanceChart}
                        />
                    </TabsContent>
                    <TabsContent value="daily-transactions">
                        <GroupStatisticsChart
                            group={group}
                            chartTitle="Transactions in time"
                            fetchFunction={fetchDailyTransactionSummaries}
                            Chart={TransactionsInTimeChart}
                        />
                    </TabsContent>
                </CardContent>
            </Tabs>
        </Card>
    );
}
