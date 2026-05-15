import { Enums } from "@/database.types";
import { ParticipantResponseJson } from "./fetch";
import { TripTransactionSplit } from "./custom-schemas";

function transactionTotalCostReducer({
    unitCost,
    calculationMethod,
    tripLength,
    participantCount,
}: {
    unitCost: number;
    calculationMethod: Enums<"trip_transaction_calculation_type">;
    tripLength?: number;
    participantCount?: number;
}) {
    let totalAmount = unitCost;
    switch (calculationMethod) {
        case "per_day":
            totalAmount = unitCost * (tripLength || 0);
            break;
        case "per_participant":
            totalAmount = unitCost * (participantCount || 0);
            break;
        case "per_participant_per_day":
            totalAmount =
                unitCost * (tripLength || 0) * (participantCount || 0);
            break;
        default:
            break;
    }
    return totalAmount;
}

function countPotentialParticipants({
    participants,
}: {
    participants: ParticipantResponseJson[];
}) {
    return participants.filter(
        (participant) => participant.status !== "declined",
    ).length;
}

function getTripLength({
    startdate,
    endDate,
}: {
    startdate: Date;
    endDate: Date;
}) {
    // One day in milliseconds
    const oneDay = 1000 * 60 * 60 * 24;

    // Calculating the time difference between two dates
    const diffInTime = endDate.getTime() - startdate.getTime();

    // Calculating the no. of days between two dates
    const diffInDays = Math.round(diffInTime / oneDay);

    return diffInDays;
}

function transactionSplitAmountLabelReducer(
    calculationMethod: Enums<"acc_transaction_split_type">,
) {
    let label = "";
    switch (calculationMethod) {
        case "manual":
            label = "Amount";
            break;
        case "percentage":
            label = "Percentage";
            break;
        case "shares":
            label = "Shares";
            break;
        default:
            break;
    }
    return label;
}

export enum TransactionSplitChangeEventType {
    CHECK = "CHECK",
    UNCHECH = "UNCHECK",
    SPLIT_TYPE_CHANGE = "SPLIT_TYPE_CHANGE",
    AMOUNT_CHANGE = "AMOUNT_CHANGE",
}

export interface TransactionSplitChangePayload {
    participants: ParticipantResponseJson[];
    splits: (TripTransactionSplit & { totalAmount?: number })[];
    totalAmount?: number | null;
}

export interface TransactionSplitChangeAction {
    type: TransactionSplitChangeEventType;
    payload: TransactionSplitChangePayload;
}

function transactionSplitTableReducer(
    state: TransactionSplitChangePayload,
    action: TransactionSplitChangeAction,
) {
    let result = state;
    switch (action.type) {
        case "CHECK":
            break;

        default:
            break;
    }
    return result;
}

export {
    transactionTotalCostReducer,
    countPotentialParticipants,
    getTripLength,
    transactionSplitAmountLabelReducer,
    transactionSplitTableReducer,
};
