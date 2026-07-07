"use client";

import { Tables } from "@/database.types";
import { useCurrentLocale, useI18n } from "@/locales/client";
import { Edit2Icon } from "lucide-react";
import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";
import { ButtonGroup } from "@/components/ui/button-group";
import TripTransactionEdit from "./edit-transaction";
import { ParticipantResponseJson } from "../fetch";
import { permissionsReducer } from "../permissions";
import DeleteTransaction from "./delete-transaction";
import {
    TripTransactionCategoryIcon,
    TripTransactionStatusPill,
} from "../icon-factories";
import { TripFinanceDataAction } from "../reducers";
import UnmarkedPayedTransaction from "./unmark-payed-transaction";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export default function TripTransaction({
    trip,
    transaction,
    className,
    onSuccess,
    ...props
}: {
    trip: Tables<"v_trip_details">;
    onSuccess: (action: TripFinanceDataAction) => void;
    transaction: Tables<"trip_transaction">;
} & ComponentProps<"div">) {
    const t = useI18n();
    const locale = useCurrentLocale();
    return (
        <div className={twMerge("@container", className)} {...props}>
            <div className="flex @max-md:flex-col flex-row gap-2 flex-nowrap justify-between grow">
                <div className="flex flex-row gap-2">
                    <TripTransactionCategoryIcon
                        category={transaction.category}
                        className="shrink"
                    />
                    <div className="space-y-2">
                        <p className="font-semibold inline-flex gap-2 flex-wrap items-center text-ellipsis">
                            {transaction.description}
                            <TripTransactionStatusPill
                                status={transaction.status}
                            />
                        </p>
                        <p className="font-light text-muted-foreground text-xs font-mono flex flex-row flex-wrap gap-2 text-ellipsis">
                            <span>
                                {t(
                                    `TripPlanner.transactions.categories.${transaction.category}`,
                                ).toLowerCase()}
                            </span>
                            |
                            <span>
                                {t(
                                    `TripPlanner.transactions.calculationType.${transaction.calculation_type}`,
                                ).toLowerCase()}
                            </span>
                            |
                            <span>
                                {t("perPersonValue", {
                                    x: `~${Intl.NumberFormat(locale, {
                                        style: "currency",
                                        currency: transaction.currency_iso_code,
                                    }).format(
                                        (transaction?.total_amount || 0) /
                                            (
                                                trip.participants as ParticipantResponseJson[]
                                            ).filter(
                                                (participant) =>
                                                    participant.status !==
                                                    "declined",
                                            ).length,
                                    )}`,
                                })}
                            </span>
                        </p>
                        <p className="font-light text-muted-foreground text-xs italic text-ellipsis h-[1.5em] ">
                            {transaction.notes}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2 flex-col items-end @max-md:flex-row @max-md:justify-between @max-md:items-center-safe">
                    <Tooltip>
                        <TooltipTrigger>
                            <p className="font-semibold">
                                {Intl.NumberFormat(locale, {
                                    style: "currency",
                                    currency: transaction?.currency_iso_code,
                                }).format(
                                    (transaction?.status === "paid"
                                        ? transaction?.total_paid_amount
                                        : transaction?.total_amount) || 0,
                                )}
                            </p>
                        </TooltipTrigger>
                        <TooltipContent>
                            {transaction?.status === "paid"
                                ? t("TripPlanner.transactions.totalPaidAmount")
                                : t("TripPlanner.transactions.plannedAmount")}
                        </TooltipContent>
                    </Tooltip>
                    <ButtonGroup>
                        {permissionsReducer({
                            tripParticipantRole: "admin",
                            permission: "plan_budget",
                        }) && transaction?.status === "paid" ? (
                            <UnmarkedPayedTransaction
                                transaction={transaction}
                                onSuccess={onSuccess}
                            />
                        ) : (
                            <>
                                <TripTransactionEdit
                                    trip={trip}
                                    transaction={transaction}
                                    variant="secondary"
                                    size="icon"
                                    buttonContent={<Edit2Icon />}
                                    onSuccess={onSuccess}
                                />
                                <DeleteTransaction
                                    transaction={transaction}
                                    onSuccess={onSuccess}
                                />
                            </>
                        )}
                    </ButtonGroup>
                </div>
            </div>
        </div>
    );
}
