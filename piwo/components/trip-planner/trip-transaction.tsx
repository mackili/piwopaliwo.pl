"use client";

import { Enums, Tables } from "@/database.types";
import { useCurrentLocale } from "@/locales/client";
import {
    ReceiptEuroIcon,
    UtensilsIcon,
    CarIcon,
    FuelIcon,
    BedIcon,
    ActivityIcon,
    MoreHorizontalIcon,
    EllipsisIcon,
} from "lucide-react";
import { ComponentProps, useState } from "react";
import { twMerge } from "tailwind-merge";
import { ButtonGroup } from "../ui/button-group";
import TripTransactionEdit from "./edit-transaction";
import { Badge } from "../ui/badge";
import { ParticipantResponseJson } from "./fetch";

function TripTransactionCategoryIcon({
    category,
    className,
    ...props
}: {
    category: Enums<"trip_transaction_category">;
} & ComponentProps<"div">) {
    let icon = <ReceiptEuroIcon className="stroke-gray-600 stroke-1" />;
    let classString = "bg-gray-400";
    switch (category) {
        case "food":
            icon = <UtensilsIcon className="stroke-red-600 stroke-1" />;
            classString = "bg-red-200";
            break;
        case "transport":
            icon = <CarIcon className="stroke-blue-600 stroke-1" />;
            classString = "bg-blue-200";
            break;
        case "fuel":
            icon = <FuelIcon className="stroke-orange-600 stroke-1" />;
            classString = "bg-orange-200";
            break;
        case "stay":
            icon = <BedIcon className="stroke-green-600 stroke-1" />;
            classString = "bg-green-200";
            break;
        case "activity":
            icon = <ActivityIcon className="stroke-purple-600 stroke-1" />;
            classString = "bg-purple-200";
            break;
        case "other":
            icon = <MoreHorizontalIcon className="stroke-gray-600 stroke-1" />;
            classString = "bg-gray-200";
            break;
        default:
            break;
    }
    return (
        <div
            className={twMerge(
                "aspect-square rounded-md w-8 h-8 flex items-center justify-center",
                classString,
                className,
            )}
            {...props}
        >
            {icon}
        </div>
    );
}

function TripTransactionStatusPill({
    status,
    className,
    ...props
}: { status: Enums<"transaction_status"> } & ComponentProps<"div">) {
    let classString = "bg-gray-200 text-gray-600 border-gray-300";
    switch (status) {
        case "idea":
            classString = "bg-blue-100 text-blue-600 border-blue-300";
            break;
        case "quoted":
            classString = "bg-yellow-100 text-yellow-600 border-yellow-300";
            break;
        case "committed":
            classString = "bg-green-100 text-green-600 border-green-300";
            break;
        case "paid":
            classString = "bg-teal-100 text-teal-600 border-teal-300";
            break;
        default:
            break;
    }

    return (
        <Badge
            className={twMerge("uppercase", classString, className)}
            {...props}
        >
            {status}
        </Badge>
    );
}

export default function TripTransaction({
    trip,
    transaction,
}: {
    trip: Tables<"v_trip_details">;
    transaction: Tables<"trip_transaction">;
}) {
    const locale = useCurrentLocale();
    const [transactionState, setTransaction] = useState(transaction);
    return (
        <div className="flex flex-row flex-wrap gap-2">
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
                                buttonContent={<EllipsisIcon />}
                                onSuccess={setTransaction}
                            />
                        )}
                    </ButtonGroup>
                </div>
            </div>
        </div>
    );
}
