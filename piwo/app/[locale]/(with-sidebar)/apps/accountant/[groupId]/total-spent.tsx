import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Group, GroupCurrency, TotalSpentObject } from "../types";
import { ComponentProps } from "react";
import { createClient } from "@/utils/supabase/server";
import { PostgrestError } from "@supabase/supabase-js";
import TotalSpentChart from "./total-spent-chart";
import PostgrestErrorDisplay from "@/components/ui/postgrest-error-display";

const DB_TOTAL_SUM_FUNCTION_NAME = "acc_get_transaction_summary";

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
    const { data: totals, error } = (await supabase.rpc(
        DB_TOTAL_SUM_FUNCTION_NAME,
        { p_group_id: group.id, p_member_id: null }
    )) as { data: TotalSpentObject[] | null; error: PostgrestError | null };
    const primaryCurrency = group.currencies.find(
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
