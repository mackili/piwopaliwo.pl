"use client";

import {
    ComponentProps,
    startTransition,
    useOptimistic,
    useState,
} from "react";
import { ParticipantResponseJson, updateParticipant } from "./fetch";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { twMerge } from "tailwind-merge";
import { Constants, Enums } from "@/database.types";
import { Button } from "../ui/button";
import { TripParticipantStatusIcon } from "./participant-avatars";

const participantStatuses = Constants.public.Enums.trip_participant_status;

export function TripParticipantStatusDisplay({
    status,
}: {
    status: Enums<"trip_participant_status">;
}) {
    return (
        <>
            <TripParticipantStatusIcon
                status={status}
                className="w-4 h-4 stroke-3"
                isColorCoded
            />{" "}
            {status}
        </>
    );
}

export default function TripParticipantStatusPicker({
    participant,
    className,
    canEdit = false,
}: {
    participant: ParticipantResponseJson;
    canEdit?: boolean;
} & ComponentProps<"select">) {
    const [status, setStatus] = useState<Enums<"trip_participant_status">>(
        participant.status,
    );
    const [optimisticStatus, setOptimisticStatus] =
        useOptimistic<Enums<"trip_participant_status">>(status);
    const handleChange = async (value: Enums<"trip_participant_status">) => {
        startTransition(async () => {
            setOptimisticStatus(value);
            const { error } = await updateParticipant(
                { status: value },
                participant.id,
            );
            if (!error) {
                setStatus(value);
            }
        });
    };
    return canEdit ? (
        <Select onValueChange={handleChange} defaultValue={optimisticStatus}>
            <SelectTrigger
                className={twMerge(
                    "text-primary stroke-primary cursor-pointer",
                    className,
                )}
                value={optimisticStatus}
            >
                <SelectValue>
                    <TripParticipantStatusDisplay status={optimisticStatus} />
                </SelectValue>
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {participantStatuses.map((status, index) => (
                        <SelectItem key={index} value={status}>
                            <TripParticipantStatusDisplay status={status} />
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    ) : (
        <Button
            variant="outline"
            type="button"
            className={twMerge(
                "text-primary stroke-primary hover:bg-background! cursor-auto",
                className,
            )}
        >
            <TripParticipantStatusDisplay status={participant.status} />
        </Button>
    );
}
