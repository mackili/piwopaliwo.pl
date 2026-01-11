"use client";
import {
    Card,
    CardAction,
    CardContent,
    CardHeader,
} from "@/components/ui/card";
import { Group } from "../types";
import { ComponentProps } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GroupStatisticsChart from "@/components/accountant/statistics/stat-chart-display";
import {
    fetchDailyTransactionSummaries,
    fetchGroupMemberBalances,
} from "@/components/accountant/statistics/fetch";
import MemberBalanceChart from "@/components/accountant/statistics/member-balance-chart";
import AggregateMemberBalanceChart from "@/components/accountant/statistics/aggregated-member-balance-chart";
import TransactionsInTimeChart from "@/components/accountant/statistics/transactions-in-time-chart";
import { useI18n } from "@/locales/client";

export default function GroupStatistics({
    group,
    ...props
}: { group: Group } & ComponentProps<"div">) {
    const t = useI18n();
    return (
        <Card {...props}>
            <Tabs defaultValue="member-balance-currency">
                <CardHeader>
                    <h4>{t("Accountant.statistics")}</h4>
                    <CardAction className="@max-sm:col-span-full @max-sm:row-start-2 @max-sm:overflow-x-scroll w-full">
                        <TabsList>
                            <TabsTrigger value="member-balance-currency">
                                {t("Accountant.stats.balancePerCurrency")}
                            </TabsTrigger>
                            <TabsTrigger value="member-balance">
                                {t("Accountant.stats.aggBalance")}
                            </TabsTrigger>
                            <TabsTrigger value="daily-transactions">
                                {t("Accountant.stats.dailyTransactions")}
                            </TabsTrigger>
                        </TabsList>
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <TabsContent value="member-balance-currency">
                        <GroupStatisticsChart
                            group={group}
                            chartTitle={t(
                                "Accountant.stats.balancePerCurrency"
                            )}
                            fetchFunction={fetchGroupMemberBalances}
                            Chart={MemberBalanceChart}
                        />
                    </TabsContent>
                    <TabsContent value="member-balance">
                        <GroupStatisticsChart
                            group={group}
                            chartTitle={t("Accountant.stats.aggBalance")}
                            fetchFunction={fetchGroupMemberBalances}
                            Chart={AggregateMemberBalanceChart}
                        />
                    </TabsContent>
                    <TabsContent value="daily-transactions">
                        <GroupStatisticsChart
                            group={group}
                            chartTitle={t("Accountant.stats.dailyTransactions")}
                            fetchFunction={fetchDailyTransactionSummaries}
                            Chart={TransactionsInTimeChart}
                        />
                    </TabsContent>
                </CardContent>
            </Tabs>
        </Card>
    );
}
