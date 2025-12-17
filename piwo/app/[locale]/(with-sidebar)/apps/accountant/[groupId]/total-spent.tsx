import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Group, GroupCurrency, TotalSpentObject } from "../types";
import { ComponentProps } from "react";
import { createClient } from "@/utils/supabase/server";
import { PostgrestError } from "@supabase/supabase-js";
import TotalSpentChart from "./total-spent-chart";
import PostgrestErrorDisplay from "@/components/ui/postgrest-error-display";

export function calculateGrandTotal(
    totals: TotalSpentObject[] | null,
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

export default async function TotalSpent({
    group,
    ...props
}: { group: Group } & ComponentProps<"div">) {
    const supabase = await createClient();
    const { data: totals, error } = (await supabase
        .from("v_group_total_spending")
        .select("iso,amount")
        .eq("group_id", group.id)
        .order("amount", { ascending: false })) as {
        data: TotalSpentObject[] | null;
        error: PostgrestError | null;
    };
    const primaryCurrency = (group?.currencies || []).find(
        (currency) => currency.primary
    );
    return (
        <Card {...props}>
            <CardHeader>
                <h4>Total Spent</h4>
            </CardHeader>
            {totals && (
                <CardContent className="flex gap-2 flex-col">
                    <h2 className="font-serif">
                        {calculateGrandTotal(totals, group?.currencies)}{" "}
                        {primaryCurrency?.iso}
                    </h2>
                    <TotalSpentChart data={totals || []} />
                </CardContent>
            )}
            <PostgrestErrorDisplay error={error} />
        </Card>
    );
}
