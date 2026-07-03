"use client";
import { Constants, Enums } from "@/database.types";
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { TripFinancialsPerCategoryJson } from "@/components/trip-planner/custom-schemas";
import { twMerge } from "tailwind-merge";
import { ComponentProps, useMemo } from "react";

const categories = [...Constants.public.Enums.trip_transaction_category].sort();

const categoryChartConfig = categories.reduce(
    (config, category, index) => {
        config[category] = {
            label: category.charAt(0).toUpperCase() + category.slice(1), // Capitalize the first letter
            color: `var(--chart-${(index % 5) + 1})`, // Use CSS variable for color
        };
        return config;
    },
    {} as Record<(typeof categories)[number], { label: string; color: string }>,
) satisfies ChartConfig;

export default function EstimateByCategory({
    data,
    className,
}: { data: TripFinancialsPerCategoryJson[] } & ComponentProps<"div">) {
    const chartData = useMemo(
        () => [
            data.reduce<Record<string, number | string>>(
                (acc, d) => ({
                    ...acc,
                    [d.category]: d.total_in_trip_currency,
                }),
                {},
            ),
        ],
        [data],
    );
    return (
        <ChartContainer
            config={categoryChartConfig}
            className={twMerge("h-12 w-full", className)}
        >
            <BarChart
                accessibilityLayer
                data={chartData}
                layout="vertical"
                margin={{ left: 0 }}
                width="100%"
                height={5}
                responsive
            >
                <ChartLegend
                    content={
                        // @ts-expect-error chart library error
                        <ChartLegendContent />
                    }
                />
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <YAxis type="category" tickLine={false} axisLine={false} hide />
                <XAxis type="number" hide />
                {Object.keys(chartData[0])
                    .sort(
                        (a, b) =>
                            (chartData[0][b] as number) -
                            (chartData[0][a] as number),
                    )
                    .map((item, index, all) => {
                        return (
                            <Bar
                                key={index}
                                dataKey={item}
                                stackId="spending"
                                fill={
                                    categoryChartConfig[
                                        item as Enums<"trip_transaction_category">
                                    ]?.color
                                }
                                radius={
                                    index === 0
                                        ? [4, 0, 0, 4]
                                        : index === all.length - 1
                                          ? [0, 4, 4, 0]
                                          : 0
                                }
                            />
                        );
                    })}
            </BarChart>
        </ChartContainer>
        // </div>
    );
}
