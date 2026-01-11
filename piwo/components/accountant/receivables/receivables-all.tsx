import {
    GroupBalance,
    GroupCurrency,
    TotalSpentObject,
} from "../../../app/[locale]/(with-sidebar)/apps/accountant/types";
import { Card, CardContent } from "@/components/ui/card";
import { calculateGrandTotal } from "../../../app/[locale]/(with-sidebar)/apps/accountant/[groupId]/grand-totals-client";
import UserRow from "@/components/ui/user-row";
import { memberName } from "../../../app/[locale]/(with-sidebar)/apps/accountant/[groupId]/members-table";
import { ArrowRight } from "lucide-react";

export default function AllReceivables({
    balances,
    currencies,
}: {
    balances: GroupBalance[] | null;
    currencies: GroupCurrency[] | null;
}) {
    const getTotalSpentObjects: () => Record<
        number,
        TotalSpentObject[]
    > = () => {
        const result: Record<number, TotalSpentObject[]> = {};
        (balances || []).forEach((balance, index) => {
            result[index] = Object.keys(balance.currency_balance).map(
                (key) => ({
                    iso: key,
                    amount: balance.currency_balance[key],
                })
            );
        });
        return result;
    };
    const totalSpentObjects = getTotalSpentObjects();
    return (
        balances &&
        currencies &&
        balances.map((balance, index) => (
            <Card key={index} className="w-full">
                <CardContent className="grid grid-cols-10 gap-2 w-full">
                    <UserRow
                        user={balance?.borrower?.user}
                        userName={memberName({
                            member: balance?.borrower,
                        })}
                        className="col-span-3"
                    />
                    <div className="col-span-4 items-center justify-items-center justify-center grid grid-rows-3">
                        <p className="text-sm whitespace-nowrap text-center">
                            {calculateGrandTotal(
                                totalSpentObjects[index],
                                currencies
                            )}{" "}
                            {
                                currencies.find((currency) => currency.primary)
                                    ?.iso
                            }
                        </p>
                        <ArrowRight />
                        <p className="flex flex-row flex-wrap gap-1 text-xs text-center">
                            {totalSpentObjects[index].map((total, index) => (
                                <span key={index} className="whitespace-nowrap">
                                    {Math.ceil(total.amount * 100) / 100}{" "}
                                    {total.iso}
                                </span>
                            ))}
                        </p>
                    </div>
                    <UserRow
                        user={balance?.lender?.user}
                        userName={memberName({
                            member: balance?.lender,
                        })}
                        className="col-span-3"
                    />
                </CardContent>
            </Card>
        ))
    );
}
