"use client";
import { memo } from "react";
import { Group, GroupCurrency, GroupMemberBalance } from "../../types";
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

function calculateGrandTotal(
    totals: { iso: string; amount: number }[] | null,
    currencies: GroupCurrency[] | null | undefined
) {
    const primaryRateTotals = (totals || []).map(
        (total) =>
            total.amount *
                ((currencies || []).find(
                    (currency) => currency.iso === total.iso
                )?.rate || 0) || 0
    );
    return (
        Math.round(
            primaryRateTotals.reduce(
                (accumulator, currentValue) => accumulator + currentValue,
                0
            ) * 100
        ) / 100
    );
}

type AggregateBalance = {
    member: string;
    amount: number;
};
const AggregateMemberBalanceChart = memo(function MemberBalanceChart({
    data,
    group,
}: {
    data?: GroupMemberBalance[] | null | undefined;
    group: Group;
}) {
    function makeChartData() {
        // const currencyIsoArray: string[] = [];
        const primaryCurrency = group.currencies?.find(
            (currency) => currency.primary
        );
        if (!primaryCurrency) {
            return { config: {}, data: [] };
        }
        const chartConfig: ChartConfig = {
            amount: {
                label: `Amount ${primaryCurrency?.iso}`,
                color: `var(--chart-1)`,
            },
        } satisfies ChartConfig;
        const chartData = (data || []).reduce(
            (aggregate: AggregateBalance[], balance) => {
                const nickname = balance.member.nickname;
                let entry = aggregate.find((agg) => agg.member === nickname);
                if (!entry) {
                    entry = { member: nickname } as AggregateBalance;
                    aggregate.push(entry);
                }
                entry["amount"] =
                    (entry["amount"] ?? 0) +
                    calculateGrandTotal(
                        [{ iso: balance.iso, amount: balance.net_amount }],
                        group.currencies
                    );
                return aggregate;
            },
            []
        );
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
export default AggregateMemberBalanceChart;
