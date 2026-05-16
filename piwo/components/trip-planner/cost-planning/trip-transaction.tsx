"use client";

import { Tables } from "@/database.types";
import { useCurrentLocale } from "@/locales/client";
import { Edit2Icon } from "lucide-react";
import { ComponentProps, useState } from "react";
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

export default function TripTransaction({
    trip,
    transaction,
    className,
    ...props
}: {
    trip: Tables<"v_trip_details">;
    transaction: Tables<"trip_transaction">;
} & ComponentProps<"div">) {
    const locale = useCurrentLocale();
    const [transactionState, setTransaction] = useState(transaction);
    return (
        <div
            className={twMerge("flex flex-row flex-wrap gap-2", className)}
            {...props}
        >
            <TripTransactionCategoryIcon
                category={transactionState.category}
                className="shrink"
            />
            <div className="flex flex-row gap-2 flex-wrap justify-between grow">
                <div className="space-y-2">
                    <p className="font-semibold inline-flex gap-2 flex-wrap items-center">
                        {transactionState.description}
                        <TripTransactionStatusPill
                            status={transactionState.status}
                        />
                    </p>
                    <p className="font-light text-muted-foreground text-xs font-mono flex flex-row flex-wrap gap-2">
                        <span>{transactionState.category}</span>|
                        <span>{transactionState.calculation_type}</span>|
                        <span>
                            {`~${Intl.NumberFormat(locale, {
                                style: "currency",
                                currency: transactionState.currency_iso_code,
                            }).format(
                                (transactionState?.total_amount || 0) /
                                    (
                                        trip.participants as ParticipantResponseJson[]
                                    ).filter(
                                        (participant) =>
                                            participant.status !== "declined",
                                    ).length,
                            )}/person`}
                        </span>
                    </p>
                    <p className="font-light text-muted-foreground text-xs italic text-ellipsis h-[1.5em]">
                        {transactionState.notes}
                    </p>
                </div>
                <div className="flex gap-2 flex-col items-end">
                    <p className="font-semibold">
                        {Intl.NumberFormat(locale, {
                            style: "currency",
                            currency: transactionState?.currency_iso_code,
                        }).format(transactionState?.total_amount || 0)}
                    </p>
                    <ButtonGroup>
                        {transactionState.status !== "paid" && (
                            <TripTransactionEdit
                                trip={trip}
                                transaction={transactionState}
                                variant="secondary"
                                size="icon"
                                buttonContent={<Edit2Icon />}
                                onSuccess={setTransaction}
                            />
                        )}
                        {permissionsReducer({
                            tripParticipantRole: "admin",
                            permission: "plan_budget",
                        }) &&
                            transactionState.status !== "paid" && (
                                <DeleteTransaction
                                    transaction={transactionState}
                                />
                            )}
                    </ButtonGroup>
                </div>
            </div>
        </div>
    );
}
