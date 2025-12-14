import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Group, GroupBalance, GroupCurrency, TotalSpentObject } from "../types";
import { ComponentProps } from "react";
import { createClient } from "@/utils/supabase/server";
import { PostgrestError } from "@supabase/supabase-js";
import PostgrestErrorDisplay from "@/components/ui/postgrest-error-display";
import UserRow from "@/components/ui/user-row";
import { memberName } from "./members-table";
import { calculateGrandTotal } from "./total-spent";
import { ArrowRight } from "lucide-react";

export default async function GroupReceivables({
    group,
    ...props
}: { group: Group } & ComponentProps<"div">) {
    const supabase = await createClient();
    const { data: balances, error: balancesError } = (await supabase
        .from("group_balance")
        .select(
            "borrower_id,lender_id,group_id,currency_balance,borrower:group_balance_borrower_id_fkey(id,nickname,user:UserInfo(firstName,lastName,userId,avatarUrl)),lender:group_balance_lender_id_fkey(id,nickname,user:UserInfo(firstName,lastName,userId,avatarUrl))"
        )
        .eq("group_id", group.id)) as {
        data: GroupBalance[] | null;
        error: PostgrestError | null;
    };
    const { data: currenciesData, error: currenciesError } = (await supabase
        .from("group")
        .select("currencies")
        .eq("id", group.id)
        .limit(1)
        .single()) as {
        data: { currencies: GroupCurrency[] } | null;
        error: PostgrestError | null;
    };
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
        <Card {...props}>
            <CardHeader>
                <h4>Receivables</h4>
            </CardHeader>
            <CardContent className="overflow-scroll flex flex-col gap-4">
                {balances &&
                    currenciesData &&
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
                                            currenciesData.currencies
                                        )}{" "}
                                        {
                                            currenciesData.currencies.find(
                                                (currency) => currency.primary
                                            )?.iso
                                        }
                                    </p>
                                    <ArrowRight />
                                    <p className="flex flex-row flex-wrap gap-1 text-xs text-center">
                                        {totalSpentObjects[index].map(
                                            (total, index) => (
                                                <span
                                                    key={index}
                                                    className="whitespace-nowrap"
                                                >
                                                    {total.amount} {total.iso}
                                                </span>
                                            )
                                        )}
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
                    ))}
                {(balancesError || currenciesError) && (
                    <PostgrestErrorDisplay
                        error={balancesError || currenciesError}
                    />
                )}
            </CardContent>
        </Card>
    );
}
