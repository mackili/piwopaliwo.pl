"use client";
import { memo, useMemo } from "react";
import { Group, GroupDailyTransactionSummary } from "../../types";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

const TransactionsInTimeChart = memo(function TransactionsInTimeChart({
    data,
    group,
}: {
    data?: GroupDailyTransactionSummary[] | null | undefined;
    group: Group;
}) {
    const convertedCurrencies = useMemo(
        () =>
            data?.map((currency) => ({
                ...currency,
                convertedRate:
                    currency.amount *
                    (group.currencies.find((curr) => curr.iso === currency.iso)
                        ?.rate || 1),
            })),
        [data, group.currencies]
    );

    //     if (!convertedCurrencies) return [];

    //     const grouped = convertedCurrencies.reduce((acc, transaction) => {
    //         const date = transaction.date.split("T")[0]; // Extract date (YYYY-MM-DD)
    //         const currency = transaction.iso;

    //         // Initialize the date entry if it doesn't exist
    //         if (!acc[date]) {
    //             acc[date] = {};
    //         }

    //         // Initialize the currency entry for the date if it doesn't exist
    //         if (!acc[date][currency]) {
    //             acc[date][currency] = 0;
    //         }

    //         // Sum up the convertedRate for the date and currency
    //         acc[date][currency] += transaction.convertedRate;

    //         return acc;
    //     }, {} as Record<string, Record<string, number>>);

    //     // Transform the grouped data into an array suitable for the chart
    //     return Object.entries(grouped).map(([date, currencies]) => ({
    //         date,
    //         ...currencies,
    //     }));
    // }, [convertedCurrencies]);
    // const allIsos = group.currencies.map((c) => c.iso);

    // const normalized = groupedData
    //     .map((row) => ({
    //         ...Object.fromEntries(allIsos.map((iso) => [iso, 0])),
    //         ...row,
    //     }))
    //     .sort((a, b) => a.date.localeCompare(b.date));
    // console.log(normalized);
    const allIsos = group.currencies.map((c) => c.iso);

    const cumulative = useMemo(() => {
        if (!convertedCurrencies) return [];

        // 1) aggregate per day per currency (your code)
        const grouped = convertedCurrencies.reduce((acc, t) => {
            const date = t.date.split("T")[0];
            const iso = t.iso;

            acc[date] ??= {};
            acc[date][iso] ??= 0;
            acc[date][`${iso}_unconverted`] ??= 0;
            acc[date][iso] += t.convertedRate;
            acc[date][`${iso}_unconverted`] += t.amount;

            return acc;
        }, {} as Record<string, Record<string, number>>);

        // 2) normalize + sort
        const daily: Record<string, string | number>[] = Object.entries(grouped)
            .map(([date, currencies]) => ({
                date,
                ...Object.fromEntries(allIsos.map((iso) => [iso, 0])),
                ...Object.fromEntries(
                    allIsos.map((iso) => [`${iso}_unconverted`, 0])
                ),
                ...currencies,
            }))
            .sort((a, b) => a.date.localeCompare(b.date));
        // 3) cumulative sum per currency
        const running = Object.fromEntries(
            allIsos.map((iso) => [iso, 0])
        ) as Record<string, number>;
        const runningUnconverted = { ...running };

        return daily.map((row) => {
            const next: Record<string, string | number> = { date: row.date };

            for (const iso of allIsos) {
                running[iso] += Number(row[iso] ?? 0);
                runningUnconverted[iso] += Number(
                    row[`${iso}_unconverted`] ?? 0
                );
                next[iso] = running[iso];
                next[`${iso}_unconverted`] = runningUnconverted[iso];
            }

            return next;
        });
    }, [convertedCurrencies, allIsos]);
    console.log(cumulative);
    return (
        <ChartContainer config={{}} className="min-h-[200px] w-full">
            <AreaChart data={cumulative}>
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="date"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                />
                <YAxis tickLine={false} tickMargin={10} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                {group.currencies.map((currency, index) => (
                    <Area
                        key={currency.iso}
                        type="monotone"
                        dataKey={currency.iso}
                        stackId="1"
                        stroke={`var(--chart-${(index % 5) + 1})`}
                        fill={`var(--chart-${(index % 5) + 1})`}
                        connectNulls
                    />
                ))}
            </AreaChart>
        </ChartContainer>
    );
});
export default TransactionsInTimeChart;
