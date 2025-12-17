"use client";
import { memo } from "react";
import {
    Group,
    GroupMemberBalance,
} from "../../../app/[locale]/(with-sidebar)/apps/accountant/types";
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

type AggregateBalance = {
    member: string;
} & Record<string, number>;
const MemberBalanceChart = memo(function MemberBalanceChart({
    data,
}: // group,
{
    data?: GroupMemberBalance[] | null | undefined;
    group: Group;
}) {
    function makeChartData() {
        const currencyIsoArray: string[] = [];
        const chartConfig: ChartConfig = {} satisfies ChartConfig;
        const chartData = (data || []).reduce(
            (aggregate: AggregateBalance[], balance) => {
                const nickname = balance.member.nickname;
                let entry = aggregate.find((agg) => agg.member === nickname);
                if (!entry) {
                    entry = { member: nickname } as AggregateBalance;
                    aggregate.push(entry);
                }
                entry[balance.iso] =
                    (entry[balance.iso] ?? 0) + balance.net_amount;
                if (!currencyIsoArray.includes(balance.iso)) {
                    currencyIsoArray.push(balance.iso);
                }
                return aggregate;
            },
            []
        );
        currencyIsoArray.map((currency, index) => {
            chartConfig[currency] = {
                label: currency,
                color: `var(--chart-${(index % 5) + 1})`,
            };
        });
        return { config: chartConfig, data: chartData };
    }
    const chartData = makeChartData();
    return (
        <ChartContainer
            config={chartData.config}
            className="min-h-[200px] w-full"
        >
            <BarChart
                accessibilityLayer
                data={chartData.data}
                stackOffset="sign"
            >
                <CartesianGrid vertical={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <YAxis tickLine={false} tickMargin={10} axisLine={false} />
                <XAxis
                    dataKey="member"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                />
                {Object.keys(chartData.config).map((key, index) => (
                    <Bar
                        key={index}
                        dataKey={key}
                        stackId={"a"}
                        radius={4}
                        fill={
                            chartData.config[key]?.color || "var(--bg-primary)"
                        }
                    ></Bar>
                ))}
            </BarChart>
        </ChartContainer>
    );
});
export default MemberBalanceChart;
