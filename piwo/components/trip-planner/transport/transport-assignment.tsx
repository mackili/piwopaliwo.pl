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
import { TransportChangeAction, TransportChangeEventType } from "../reducers";
import { deleteTravelAssignment, upsertTravelAssignment } from "../fetch";
import { twMerge } from "tailwind-merge";
import { TripParticipantsContext } from "../accommodation/accommodation-cards-overview";
import { TravelAssignedParticipantContext } from "./transport-card";

export enum TravelAssignmentModes {
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
    const assignedParticipants = useContext(TravelAssignedParticipantContext);
    const handleSelect = (
        value: Tables<"v_trip_participant_details"> | null,
    ) => {
        if (onChange) onChange(value);
    };
    const availableParticipants = participants.filter(
        (participant) =>
            participant?.id &&
            (!assignedParticipants.includes(participant.id) ||
                selectedParticipant?.id === participant.id),
    );
    return (
        <Combobox
            items={availableParticipants}
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

export default function TransportAssignment({
    assignment,
    tripTravelId,
    onChange,
    optimisticOnChange,
}: {
    assignment?: Tables<"v_trip_participant_details">;
    tripTravelId: string;
    onChange: (action: TransportChangeAction) => void;
    optimisticOnChange: (action: TransportChangeAction) => void;
}) {
    const [mode, setMode] = useState<TravelAssignmentModes>(
        assignment ? TravelAssignmentModes.READ : TravelAssignmentModes.SET,
    );
    const handleEdit = () => {
        setMode(TravelAssignmentModes.EDIT);
    };

    const handleChange = async (
        value: Tables<"v_trip_participant_details"> | null,
    ) => {
        startTransition(async () => {
            if (value?.id) {
                const previousValue = assignment;
                optimisticOnChange({
                    type: TransportChangeEventType.PARTICIPANT_ASSIGNED,
                    payload: {
                        assigned: {
                            ...value,
                            trip_travel_id: tripTravelId,
                        },
                        removed: previousValue
                            ? {
                                  ...previousValue,
                              }?.id
                            : null,
                    },
                });
                setMode(TravelAssignmentModes.READ);
                if (previousValue?.id) {
                    await deleteTravelAssignment(
                        tripTravelId,
                        previousValue.id,
                    );
                }
                await upsertTravelAssignment(tripTravelId, value.id);
                onChange({
                    type: TransportChangeEventType.PARTICIPANT_ASSIGNED,
                    payload: {
                        assigned: {
                            ...value,
                            trip_travel_id: tripTravelId,
                        },
                        removed: previousValue
                            ? {
                                  ...previousValue,
                              }?.id
                            : null,
                    },
                });
            } else {
                setMode(TravelAssignmentModes.SET);
                const previousValue = { ...assignment };
                if (previousValue && previousValue?.id) {
                    optimisticOnChange({
                        type: TransportChangeEventType.PARTICIPANT_ASSIGNMENT_REMOVED,
                        payload: previousValue.id,
                    });
                    await deleteTravelAssignment(
                        tripTravelId,
                        previousValue.id,
                    );
                    onChange({
                        type: TransportChangeEventType.PARTICIPANT_ASSIGNMENT_REMOVED,
                        payload: previousValue.id,
                    });
                }
            }
        });
    };

    return assignment && mode === TravelAssignmentModes.READ ? (
        <ParticipantRow
            participant={assignment}
            onClick={handleEdit}
            className="hover:outline-2 outline-0 outline-muted outline-dashed transition-all ease-in-out outline-offset-4 rounded-sm"
        />
    ) : mode === TravelAssignmentModes.EDIT ? (
        <SetAccommodationUnitAssignment
            accommodationUnitId={tripTravelId}
            selectedParticipant={assignment}
            onChange={handleChange}
        />
    ) : (
        <SetAccommodationUnitAssignment
            accommodationUnitId={tripTravelId}
            onChange={handleChange}
        />
    );
}
