import { Enums, Tables, TablesInsert } from "@/database.types";
import { ParticipantResponseJson } from "./fetch";
import {
    TripAccommodationSummaryView,
    TripTransactionSplit,
} from "./custom-schemas";

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
    let result = state;
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
    // let result = { ...state };
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
            default:
                break;
        }
        return result;
    });
    // console.log(resultArray);
    // return resultArray;
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
    viewTripParticipantDetailsToParticipantResponseJson,
    accommodationModificationReducer,
    calculateAccommodationTotalCapacity,
    calculateAccommodationUsedCapacity,
    transportChangeReducer,
};
