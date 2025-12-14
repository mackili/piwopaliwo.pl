"use client";
import {
    GroupBalance,
    GroupCurrency,
    GroupMember,
    TotalSpentObject,
} from "../../types";
import { Card, CardContent } from "@/components/ui/card";
import { calculateGrandTotal } from "../grand-totals-client";
import UserRow from "@/components/ui/user-row";
import { memberName } from "../members-table";
import { ArrowRight } from "lucide-react";
import { memo, useMemo } from "react";
import { optimizeTransactions } from "./lp-optimization";
import ErrorMessage from "@/components/ui/error-message";

type MemberAggregates = Record<string, Record<string, number[]>>;

const OptimizedReceivables = memo(function OptimizedReceivables({
    balances,
    currencies,
    groupMembers,
}: {
    balances: GroupBalance[] | null;
    currencies: GroupCurrency[] | null;
    groupMembers: GroupMember[];
}) {
    const getAggregateBalancesPerGroupMember: MemberAggregates = useMemo(() => {
        return (
            balances?.reduce((result: MemberAggregates, entry) => {
                const borrowerId = entry.borrower_id;
                const lender_id = entry.lender_id;
                if (!result[borrowerId]) {
                    result[borrowerId] = {};
                }
                Object.keys(entry.currency_balance).forEach((currency) => {
                    if (!result[borrowerId][currency]) {
                        result[borrowerId][currency] = [];
                    }
                    result[borrowerId][currency].push(
                        -entry.currency_balance[currency]
                    );
                });
                if (!result[lender_id]) {
                    result[lender_id] = {};
                }
                Object.keys(entry.currency_balance).forEach((currency) => {
                    if (!result[lender_id][currency]) {
                        result[lender_id][currency] = [];
                    }
                    result[lender_id][currency].push(
                        entry.currency_balance[currency]
                    );
                });
                return result;
            }, {}) || {}
        );
    }, [balances]);
    // Calculate single currency balances using calculateGrandTotal
    const singleCurrencyBalances = useMemo(() => {
        if (!getAggregateBalancesPerGroupMember || !currencies) return {};

        return Object.entries(getAggregateBalancesPerGroupMember).reduce(
            (result, [memberId, currencyBalances]) => {
                const totals: TotalSpentObject[] = Object.entries(
                    currencyBalances
                ).map(([currency, amounts]) => ({
                    iso: currency,
                    amount: amounts.reduce((sum, value) => sum + value, 0),
                }));

                result[memberId] = calculateGrandTotal(totals, currencies);
                console.log(result);
                return result;
            },
            {} as Record<string, number>
        );
    }, [getAggregateBalancesPerGroupMember, currencies]);
    const { data: optimizedData, error: optimizationError } = useMemo(
        () => optimizeTransactions(singleCurrencyBalances),
        [singleCurrencyBalances]
    );

    const findMember = (memberId: string) => {
        const member = groupMembers.find((member) => member.id === memberId);
        return member;
    };
    return (
        <>
            {optimizedData &&
                optimizedData.map((transfer, index) => (
                    <Card key={index} className="w-full">
                        <CardContent className="grid grid-cols-12 gap-2 w-full">
                            {findMember(transfer.from) && (
                                <UserRow
                                    user={findMember(transfer.from)?.user}
                                    userName={memberName({
                                        // @ts-expect-error not passing all necessary attributes
                                        member: findMember(transfer.from) || {
                                            nickname: "Unknown",
                                        },
                                    })}
                                    className="col-span-5"
                                />
                            )}
                            <div className="col-span-2 items-center justify-items-center justify-center grid grid-rows-2">
                                <p className="text-sm whitespace-nowrap text-center">
                                    {transfer.amount}{" "}
                                    {currencies?.find(
                                        (currency) => currency.primary
                                    )?.iso || ""}
                                </p>
                                <ArrowRight />
                            </div>
                            {findMember(transfer.to) && (
                                <UserRow
                                    user={findMember(transfer.to)?.user}
                                    userName={memberName({
                                        // @ts-expect-error not passing all necessary attributes
                                        member: findMember(transfer.to) || {
                                            nickname: "Unknown",
                                        },
                                    })}
                                    className="col-span-5"
                                />
                            )}
                        </CardContent>
                    </Card>
                ))}
            {optimizationError && <ErrorMessage error={optimizationError} />}
        </>
    );
});
export default OptimizedReceivables;
