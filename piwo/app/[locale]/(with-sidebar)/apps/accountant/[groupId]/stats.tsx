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
import { fetchGroupMemberBalances } from "./(statistics)/fetch";
import MemberBalanceChart from "./(statistics)/member-balance-chart";
import AggregateMemberBalanceChart from "./(statistics)/aggregated-member-balance-chart";

export default function GroupStatistics({
    group,
    ...props
}: { group: Group } & ComponentProps<"div">) {
    return (
        <Card {...props}>
            <Tabs defaultValue="member-balance-currency">
                <CardHeader>
                    <h4>{`${group.name}'s`} Statistics</h4>
                    <CardAction>
                        <TabsList>
                            <TabsTrigger value="member-balance-currency">
                                Balance per currency
                            </TabsTrigger>
                            <TabsTrigger value="member-balance">
                                Aggregate balance
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
                </CardContent>
            </Tabs>
        </Card>
    );
}
