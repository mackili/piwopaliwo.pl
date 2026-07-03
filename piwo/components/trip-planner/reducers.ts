import { Enums, Tables, TablesInsert } from "@/database.types";
import {
    ParticipantResponseJson,
    TripPlannedFinanceStatisticsResponse,
} from "./fetch";
import {
    TripAccommodationSummaryView,
    TripTransactionSplit,
} from "./custom-schemas";
import { PostgrestError } from "@supabase/supabase-js";

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
    unit = "days",
}: {
    startdate: Date;
    endDate: Date;
    unit?: "days" | "hours" | "minutes";
}) {
    // One day in milliseconds
    const oneDay = 1000 * 60 * 60 * 24;
    const oneHour = 1000 * 60 * 60;
    const oneMinute = 1000 * 60;

    // Calculating the time difference between two dates
    const diffInTime = endDate.getTime() - startdate.getTime();

    // Calculating the no. of days between two dates
    switch (unit) {
        case "days":
            return Math.floor(diffInTime / oneDay);
            break;
        case "hours":
            return Math.floor(diffInTime / oneHour);
            break;
        case "minutes":
            return Math.floor(diffInTime / oneMinute);
            break;
        default:
            return diffInTime;
            break;
    }
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
    const result = state;
    switch (action.type) {
        case "CHECK":
            break;

        default:
            break;
    }
    return result;
}

function viewTripParticipantDetailsToParticipantResponseJson(
    participantDetails: Tables<"v_trip_participant_details">[],
): ParticipantResponseJson[] {
    return participantDetails.map((participant) => ({
        ...participant,
        group_member: {
            id: participant.group_member_id,
            nickname: participant.nickname,
            status: participant.group_member_status,
        },
        user: {
            id: participant?.user_id,
            first_name: participant?.first_name,
            last_name: participant?.last_name,
            avatar_url: participant?.avatar_url,
        },
    })) as ParticipantResponseJson[];
}
export enum AccommodationModificationSplitChangeEventType {
    UNIT_ADDED = "UNIT_ADDED",
    UNIT_REMOVED = "UNIT_REMOVED",
    UNIT_MODIFIED = "UNIT_MODIFIED",
    PARTICIPANT_ASSIGNED = "PARTICIPANT_ASSIGNED",
    PARTICIPANT_ASSIGNMENT_REMOVED = "PARTICIPANT_ASSIGNMENT_REMOVED",
    ACCOMMODATION_DETAILS_CHANGED = "ACCOMMODATION_DETAILS_CHANGED",
    ACCOMMODATION_DELETED = "ACCOMMODATION_DELETED",
    TRANSACTION_LINKED = "TRANSACTION_LINKED",
    TRANSACTION_UNLINKED = "TRANSACTION_UNLINKED",
}

// Mapped type for better readability and maintainability
export type AccommodationModificationChangePayloadMap = {
    [AccommodationModificationSplitChangeEventType.UNIT_ADDED]: Tables<"accommodation_unit">;
    [AccommodationModificationSplitChangeEventType.UNIT_REMOVED]: string;
    [AccommodationModificationSplitChangeEventType.UNIT_MODIFIED]: Tables<"accommodation_unit">;
    [AccommodationModificationSplitChangeEventType.PARTICIPANT_ASSIGNED]: {
        assigned: Tables<"v_trip_participant_details"> & {
            accommodation_unit_id: string;
        };
        removed:
            | (Tables<"v_trip_participant_details"> & {
                  accommodation_unit_id: string;
              })
            | null;
    };
    [AccommodationModificationSplitChangeEventType.PARTICIPANT_ASSIGNMENT_REMOVED]: string;
    [AccommodationModificationSplitChangeEventType.ACCOMMODATION_DETAILS_CHANGED]: Tables<"accommodation">;
    [AccommodationModificationSplitChangeEventType.ACCOMMODATION_DELETED]: string;
    [AccommodationModificationSplitChangeEventType.TRANSACTION_LINKED]: {
        id: string;
        description: string;
        total_amount: number | null;
        currency_iso_code: string;
        related_record_id: string | null;
    };
    [AccommodationModificationSplitChangeEventType.TRANSACTION_UNLINKED]: string;
};

// Conditional type for payload
export type AccommodationModificationChangeAction = {
    [T in AccommodationModificationSplitChangeEventType]: {
        type: T;
        payload: AccommodationModificationChangePayloadMap[T];
    };
}[AccommodationModificationSplitChangeEventType];
function accommodationModificationReducer(
    state: (TripAccommodationSummaryView & {
        totalCapacity: number;
        usedCapacity: number;
    })[],
    action: AccommodationModificationChangeAction,
) {
    const resultArray = [...state];
    if (
        action.type ===
        AccommodationModificationSplitChangeEventType.ACCOMMODATION_DELETED
    ) {
        const filteredResult = resultArray.filter(
            (accommodation) => accommodation.id !== action.payload,
        );
        return filteredResult;
    }
    if (
        action.type ===
            AccommodationModificationSplitChangeEventType.ACCOMMODATION_DETAILS_CHANGED &&
        !resultArray.find(
            (accommodation) => accommodation.id === action.payload.id,
        )
    ) {
        resultArray.push({
            ...action.payload,
            accommodation_units: [],
            currency_iso_code: null,
            total_amount: null,
            totalCapacity: 0,
            usedCapacity: 0,
        });
        return resultArray;
    }
    return resultArray.map((result) => {
        switch (action.type) {
            case AccommodationModificationSplitChangeEventType.UNIT_ADDED:
                result.accommodation_units = [
                    ...result.accommodation_units.filter(
                        (unit) => unit.id !== action.payload.id,
                    ),
                    {
                        ...action.payload,
                        assignments: [],
                    },
                ];
                result.totalCapacity = calculateAccommodationTotalCapacity(
                    result.accommodation_units,
                );
                result.usedCapacity = calculateAccommodationUsedCapacity(
                    result.accommodation_units,
                );
                break;
            case AccommodationModificationSplitChangeEventType.UNIT_MODIFIED:
                result.accommodation_units = [
                    ...result.accommodation_units,
                ].map((unit) => {
                    return unit.id === action.payload.id
                        ? { ...unit, ...action.payload }
                        : unit;
                });
                result.totalCapacity = calculateAccommodationTotalCapacity(
                    result.accommodation_units,
                );
                result.usedCapacity = calculateAccommodationUsedCapacity(
                    result.accommodation_units,
                );
                break;
            case AccommodationModificationSplitChangeEventType.UNIT_REMOVED:
                result.accommodation_units = [
                    ...result.accommodation_units,
                ].filter((unit) => unit.id !== action.payload);
                result.totalCapacity = calculateAccommodationTotalCapacity(
                    result.accommodation_units,
                );
                result.usedCapacity = calculateAccommodationUsedCapacity(
                    result.accommodation_units,
                );
                break;
            case AccommodationModificationSplitChangeEventType.ACCOMMODATION_DETAILS_CHANGED:
                return result?.id === action.payload.id
                    ? { ...result, ...action.payload }
                    : result;
                // result = { ...state, ...action.payload };
                break;
            case AccommodationModificationSplitChangeEventType.PARTICIPANT_ASSIGNED:
                const accommodationUnits = [...result.accommodation_units].map(
                    (unit) => ({
                        ...unit,
                        assignments: unit.assignments.filter(
                            (assignment) =>
                                assignment.id !== action.payload.assigned.id &&
                                assignment.id !== action.payload.removed?.id,
                        ),
                    }),
                );
                accommodationUnits
                    .find(
                        (unit) =>
                            unit.id ===
                            action.payload.assigned.accommodation_unit_id,
                    )
                    ?.assignments.push(action.payload.assigned);
                result.accommodation_units = accommodationUnits.map((unit) => ({
                    ...unit,
                    assigned_participants: unit.assignments.length,
                }));
                result.totalCapacity = calculateAccommodationTotalCapacity(
                    result.accommodation_units,
                );
                result.usedCapacity = calculateAccommodationUsedCapacity(
                    result.accommodation_units,
                );
                break;
            case AccommodationModificationSplitChangeEventType.PARTICIPANT_ASSIGNMENT_REMOVED:
                const modifiedAccommodationUnits = [
                    ...result.accommodation_units,
                ].map((unit) => ({
                    ...unit,
                    assignments: unit.assignments.filter(
                        (assignment) => assignment.id !== action.payload,
                    ),
                }));
                result.accommodation_units = modifiedAccommodationUnits.map(
                    (unit) => ({
                        ...unit,
                        assigned_participants: unit.assignments.length,
                    }),
                );
                result.totalCapacity = calculateAccommodationTotalCapacity(
                    result.accommodation_units,
                );
                result.usedCapacity = calculateAccommodationUsedCapacity(
                    result.accommodation_units,
                );
                break;
            case AccommodationModificationSplitChangeEventType.TRANSACTION_LINKED:
                return result?.id === action.payload.related_record_id
                    ? {
                          ...result,
                          currency_iso_code: action.payload.currency_iso_code,
                          total_amount: action.payload.total_amount,
                          trip_transaction_id: action.payload.id,
                      }
                    : result;
                break;
            case AccommodationModificationSplitChangeEventType.TRANSACTION_UNLINKED:
                return result?.id === action.payload
                    ? {
                          ...result,
                          currency_iso_code: null,
                          total_amount: null,
                          trip_transaction_id: null,
                      }
                    : result;
                break;
            default:
                break;
        }
        return result;
    });
}

function calculateAccommodationTotalCapacity(
    accommodationUnits: TablesInsert<"accommodation_unit">[],
) {
    return accommodationUnits.reduce(
        (acc, cur) => acc + (cur?.capacity || 0),
        0,
    );
}

function calculateAccommodationUsedCapacity(
    accommodationUnits: TablesInsert<"accommodation_unit">[],
) {
    return accommodationUnits.reduce(
        (acc, cur) => acc + (cur?.assigned_participants || 0),
        0,
    );
}

export enum TransportChangeEventType {
    PARTICIPANT_ASSIGNED = "PARTICIPANT_ASSIGNED",
    PARTICIPANT_ASSIGNMENT_REMOVED = "PARTICIPANT_ASSIGNMENT_REMOVED",
    TRANSPORT_DETAILS_CHANGED = "TRANSPORT_DETAILS_CHANGED",
    TRANSACTION_LINKED = "TRANSACTION_LINKED",
    TRANSACTION_UNLINKED = "TRANSACTION_UNLINKED",
}

// Mapped type for better readability and maintainability
export type TransportChangePayloadMap = {
    [TransportChangeEventType.PARTICIPANT_ASSIGNED]: {
        assigned: Tables<"v_trip_participant_details"> & {
            trip_travel_id: string;
        };
        removed: string | null;
    };
    [TransportChangeEventType.PARTICIPANT_ASSIGNMENT_REMOVED]: string;
    [TransportChangeEventType.TRANSPORT_DETAILS_CHANGED]: Tables<"trip_travel">;
    [TransportChangeEventType.TRANSACTION_LINKED]: {
        id: string;
        description: string;
        total_amount: number | null;
        currency_iso_code: string;
        related_record_id: string | null;
    };
    [TransportChangeEventType.TRANSACTION_UNLINKED]: null;
};

// Conditional type for payload
export type TransportChangeAction = {
    [T in TransportChangeEventType]: {
        type: T;
        payload: TransportChangePayloadMap[T];
    };
}[TransportChangeEventType];

function transportChangeReducer(
    state: Tables<"v_trip_travel_summary">,
    action: TransportChangeAction,
) {
    let result = { ...state };
    switch (action.type) {
        case TransportChangeEventType.TRANSPORT_DETAILS_CHANGED:
            result = { ...state, ...action.payload };
            break;
        case TransportChangeEventType.PARTICIPANT_ASSIGNED:
            result.trip_travel_assignments = [
                ...(
                    (result.trip_travel_assignments ||
                        []) as Tables<"v_trip_participant_details">[]
                ).filter(
                    (assignment) =>
                        assignment.id !== action.payload?.removed &&
                        assignment.id !== action.payload.assigned?.id,
                ),
                action.payload.assigned,
            ];
            break;
        case TransportChangeEventType.PARTICIPANT_ASSIGNMENT_REMOVED:
            result.trip_travel_assignments = [
                ...(
                    (result.trip_travel_assignments ||
                        []) as Tables<"v_trip_participant_details">[]
                ).filter((assignment) => assignment.id !== action.payload),
            ];
            break;
        case TransportChangeEventType.TRANSACTION_LINKED:
            result = {
                ...state,
                total_amount: action.payload.total_amount,
                currency_iso_code: action.payload.currency_iso_code,
                trip_transaction_id: action.payload.id,
            };
            break;
        case TransportChangeEventType.TRANSACTION_UNLINKED:
            result = {
                ...state,
                total_amount: null,
                currency_iso_code: null,
                trip_transaction_id: null,
            };
            break;
        default:
            break;
    }
    return result;
}

export enum TransactionFetchActionType {
    FETCH = "FETCH",
    APPEND = "APPEND",
    UPDATE = "UPDATE",
    DELETE = "DELETE",
}

export interface TransactionFetchPayloadMap {
    [TransactionFetchActionType.APPEND]: Tables<"trip_transaction">[];
    [TransactionFetchActionType.FETCH]: Tables<"trip_transaction">[];
    [TransactionFetchActionType.UPDATE]: Tables<"trip_transaction">;
    [TransactionFetchActionType.DELETE]: string[];
}

// export interface TransactionFetchAction {
//     type: TransactionFetchActionType;
//     payload: TransactionFetchPayloadMap;
// }

export type TransactionFetchAction = {
    [T in TransactionFetchActionType]: {
        type: T;
        payload: TransactionFetchPayloadMap[T];
    };
}[TransactionFetchActionType];

function tripTransactionsReducer(
    state: Tables<"trip_transaction">[],
    action: TransactionFetchAction,
) {
    let result = state;
    switch (action.type) {
        case TransactionFetchActionType.APPEND:
            result = [...state, ...action.payload];
            break;
        case TransactionFetchActionType.FETCH:
            result = action.payload;
            break;
        case TransactionFetchActionType.UPDATE:
            result = [...state].map((transaction) =>
                transaction.id === action.payload.id
                    ? { ...transaction, ...action.payload }
                    : transaction,
            );
            break;
        case TransactionFetchActionType.DELETE:
            result = [...state].filter(
                (transaction) => !action.payload.includes(transaction.id),
            );
            break;
        default:
            break;
    }
    return result;
}

export enum TripFinanceDataActionType {
    FETCH_PLANNED = "FETCH_PLANNED",
    APPEND_PLANNED = "APPEND_PLANNED",
    UPDATE_PLANNED = "UPDATE_PLANNED",
    DELETE_PLANNED = "DELETE_PLANNED",
    FETCH_PLANNED_STATISTICS = "FETCH_PLANNED_STATISTICS",
}

export interface TripPlannedTransactionsResult {
    data: Tables<"trip_transaction">[] | null;
    error: PostgrestError | null;
    count: number | null;
    isLoading: boolean;
}

export interface TripFinanceData {
    planned: {
        statistics: {
            data: TripPlannedFinanceStatisticsResponse | null;
            error: PostgrestError | null;
            isLoading: boolean;
        };
        transactions: TripPlannedTransactionsResult;
    };
}

export interface TripFinanceDataPayloadMap {
    [TripFinanceDataActionType.APPEND_PLANNED]: Tables<"trip_transaction">[];
    [TripFinanceDataActionType.FETCH_PLANNED]: TripPlannedTransactionsResult;
    [TripFinanceDataActionType.UPDATE_PLANNED]: Tables<"trip_transaction">[];
    [TripFinanceDataActionType.DELETE_PLANNED]: string[];
    [TripFinanceDataActionType.FETCH_PLANNED_STATISTICS]: {
        data: TripPlannedFinanceStatisticsResponse | null;
        error: PostgrestError | null;
        isLoading: boolean;
    };
}

export type TripFinanceDataAction = {
    [T in TripFinanceDataActionType]: {
        type: T;
        payload: TripFinanceDataPayloadMap[T];
    };
}[TripFinanceDataActionType];

function tripFinanceDataReducer(
    state: TripFinanceData,
    action: TripFinanceDataAction,
) {
    const newState = { ...state };
    switch (action.type) {
        case TripFinanceDataActionType.FETCH_PLANNED_STATISTICS:
            newState.planned.statistics = action.payload;
            break;
        case TripFinanceDataActionType.FETCH_PLANNED:
            newState.planned.transactions = action.payload;
            break;
        case TripFinanceDataActionType.APPEND_PLANNED:
            const oldTransactionIdsSet = new Set(
                (state.planned.transactions.data || []).map(
                    (transaction) => transaction.id,
                ),
            );
            const oldArray = state.planned.transactions.data || [];
            action.payload.forEach((transaction) => {
                if (oldTransactionIdsSet.has(transaction.id)) {
                    return;
                }
                oldArray.push(transaction);
            });
            newState.planned.transactions.data = oldArray;
            break;
        case TripFinanceDataActionType.UPDATE_PLANNED:
            const newArray = [...(state.planned.transactions.data || [])];
            action.payload.forEach((transaction) => {
                const indexOfTransaction = (
                    state.planned.transactions.data || []
                ).findIndex((t) => t.id === transaction.id);
                if (indexOfTransaction === -1) {
                    newArray.push(transaction);
                } else {
                    newArray[indexOfTransaction] = transaction;
                }
                console.log(indexOfTransaction);
            });
            newState.planned.transactions.data = newArray;
            console.log(newArray);
            break;
        case TripFinanceDataActionType.DELETE_PLANNED:
            const deletedIdSet = new Set(action.payload);
            newState.planned.transactions.data = [
                ...(state.planned.transactions.data || []),
            ].filter((transaction) => !deletedIdSet.has(transaction.id));
            newState.planned.transactions.count = Math.max(
                0,
                (state.planned.transactions.count || 0) - action.payload.length,
            );
            break;
        default:
            break;
    }
    return newState;
}

export {
    transactionTotalCostReducer,
    countPotentialParticipants,
    getTripLength,
    transactionSplitAmountLabelReducer,
    transactionSplitTableReducer,
    viewTripParticipantDetailsToParticipantResponseJson,
    accommodationModificationReducer,
    calculateAccommodationTotalCapacity,
    calculateAccommodationUsedCapacity,
    transportChangeReducer,
    tripTransactionsReducer,
    tripFinanceDataReducer,
};
