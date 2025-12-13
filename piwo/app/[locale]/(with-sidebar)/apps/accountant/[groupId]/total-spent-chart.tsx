"use client";

import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart } from "recharts";
import { TotalSpentObject } from "../types";

export default function TotalSpentChart({
    data,
}: {
    data: TotalSpentObject[];
}) {
    const chartData = data.reduce((acc, { iso, amount }) => {
        acc["label"] = iso;
        acc[iso] = amount;
        return acc;
    }, {} as Record<string, number | string>);
    console.log(chartData);
    const chartConfig = data.reduce((config, { iso }, index) => {
        config[iso] = {
            label: iso,
            color: `var(--chart-${(index % 5) + 1})`,
        };
        return config;
    }, {} as ChartConfig);
    return (
        <ChartContainer config={chartConfig} className="min-h-8 w-full">
            <BarChart accessibilityLayer data={[chartData]}>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <ChartLegend content={<ChartLegendContent />} />
                {Object.keys(chartConfig).map((iso) => (
                    <Bar
                        key={iso}
                        dataKey={iso}
                        fill={chartConfig[iso].color}
                        radius={4}
                    ></Bar>
                ))}
            </BarChart>
        </ChartContainer>
    );
}
