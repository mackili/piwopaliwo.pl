import { GroupCurrency, TotalSpentObject } from "../types";

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
