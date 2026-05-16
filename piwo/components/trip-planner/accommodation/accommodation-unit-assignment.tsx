"use client";

import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from "@/components/ui/combobox";
import { UserAvatar } from "@/components/user-avatar";
import { Tables } from "@/database.types";
import { ComponentProps, startTransition, useContext, useState } from "react";
import { TripParticipantsContext } from "./accommodation-cards-overview";
import {
    AccommodationModificationChangeAction,
    AccommodationModificationSplitChangeEventType,
} from "../reducers";
import {
    removeAccommodationAssignment,
    upsertAccommodationAssignments,
} from "../fetch";
import { twMerge } from "tailwind-merge";

export enum AccommodationUnitAssignmentModes {
    READ = "READ",
    EDIT = "EDIT",
    SET = "SET",
}

export function SetAccommodationUnitAssignment({
    accommodationUnitId,
    selectedParticipant,
    onChange,
    disabled = false,
}: {
    accommodationUnitId: string;
    selectedParticipant?: Tables<"v_trip_participant_details"> | null;
    onChange?: (
        participant: Tables<"v_trip_participant_details"> | null,
    ) => void;
    disabled?: boolean;
}) {
    const participants = useContext(TripParticipantsContext);
    const handleSelect = (
        value: Tables<"v_trip_participant_details"> | null,
    ) => {
        if (onChange) onChange(value);
    };
    return (
        <Combobox
            items={participants}
            itemToStringLabel={(
                participant: Tables<"v_trip_participant_details">,
            ) =>
                participant?.nickname ||
                `${participant?.first_name} ${participant?.last_name}`
            }
            itemToStringValue={(
                participant: Tables<"v_trip_participant_details">,
            ) => participant?.id || ""}
            onValueChange={(value) => handleSelect(value)}
            value={selectedParticipant}
            disabled={disabled}
        >
            <ComboboxInput
                placeholder="Select a participant"
                className="border-dashed"
                showClear
            />
            <ComboboxContent>
                <ComboboxEmpty>No participants left to assign</ComboboxEmpty>
                <ComboboxList>
                    {(participant) => (
                        <ComboboxItem
                            key={`${accommodationUnitId}-${participant.id}`}
                            value={participant}
                        >
                            <ParticipantRow participant={participant} />
                        </ComboboxItem>
                    )}
                </ComboboxList>
            </ComboboxContent>
        </Combobox>
    );
}

export function ParticipantRow({
    participant,
    className,
    ...props
}: {
    participant: Tables<"v_trip_participant_details">;
} & ComponentProps<"div">) {
    return (
        <div
            className={twMerge(
                "inline-flex flex-wrap gap-2 items-center",
                className,
            )}
            {...props}
        >
            <UserAvatar
                avatarUrl={participant.avatar_url}
                name={
                    participant?.nickname ||
                    `${participant?.first_name} ${participant?.last_name}`
                }
            />
            <p>
                {participant?.nickname ||
                    `${participant?.first_name} ${participant?.last_name}`}
            </p>
        </div>
    );
}

export default function AccommodationUnitAssignment({
    assignment,
    accommodationUnitId,
    onChange,
    onOptimisticChange,
}: {
    assignment?: Tables<"v_trip_participant_details">;
    accommodationUnitId: string;
    onChange: (action: AccommodationModificationChangeAction) => void;
    onOptimisticChange: (action: AccommodationModificationChangeAction) => void;
}) {
    const [mode, setMode] = useState<AccommodationUnitAssignmentModes>(
        assignment
            ? AccommodationUnitAssignmentModes.READ
            : AccommodationUnitAssignmentModes.SET,
    );
    const handleEdit = () => {
        setMode(AccommodationUnitAssignmentModes.EDIT);
    };

    const handleChange = async (
        value: Tables<"v_trip_participant_details"> | null,
    ) => {
        startTransition(async () => {
            if (value?.id) {
                const previousValue = assignment;
                onOptimisticChange({
                    type: AccommodationModificationSplitChangeEventType.PARTICIPANT_ASSIGNED,
                    payload: {
                        assigned: {
                            ...value,
                            accommodation_unit_id: accommodationUnitId,
                        },
                        removed: previousValue
                            ? {
                                  ...previousValue,
                                  accommodation_unit_id: accommodationUnitId,
                              }
                            : null,
                    },
                });
                if (previousValue?.id) {
                    await removeAccommodationAssignment(
                        previousValue.id,
                        accommodationUnitId,
                    );
                }
                await upsertAccommodationAssignments(
                    value.id,
                    accommodationUnitId,
                );
                onChange({
                    type: AccommodationModificationSplitChangeEventType.PARTICIPANT_ASSIGNED,
                    payload: {
                        assigned: {
                            ...value,
                            accommodation_unit_id: accommodationUnitId,
                        },
                        removed: previousValue
                            ? {
                                  ...previousValue,
                                  accommodation_unit_id: accommodationUnitId,
                              }
                            : null,
                    },
                });
                setMode(AccommodationUnitAssignmentModes.READ);
            } else {
                const previousValue = { ...assignment };
                if (previousValue && previousValue?.id) {
                    onOptimisticChange({
                        type: AccommodationModificationSplitChangeEventType.PARTICIPANT_ASSIGNMENT_REMOVED,
                        payload: previousValue.id,
                    });
                    await removeAccommodationAssignment(
                        previousValue.id,
                        accommodationUnitId,
                    );
                    onChange({
                        type: AccommodationModificationSplitChangeEventType.PARTICIPANT_ASSIGNMENT_REMOVED,
                        payload: previousValue.id,
                    });
                }
                setMode(AccommodationUnitAssignmentModes.SET);
            }
        });
    };

    return assignment && mode === AccommodationUnitAssignmentModes.READ ? (
        <ParticipantRow
            participant={assignment}
            onClick={handleEdit}
            className="hover:outline-2 outline-0 outline-muted outline-dashed transition-all ease-in-out outline-offset-4 rounded-sm"
        />
    ) : mode === AccommodationUnitAssignmentModes.EDIT ? (
        <SetAccommodationUnitAssignment
            accommodationUnitId={accommodationUnitId}
            selectedParticipant={assignment}
            onChange={handleChange}
        />
    ) : (
        <SetAccommodationUnitAssignment
            accommodationUnitId={accommodationUnitId}
            onChange={handleChange}
        />
    );
}
