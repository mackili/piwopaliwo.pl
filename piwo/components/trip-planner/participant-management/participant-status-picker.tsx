"use client";

import {
    ComponentProps,
    startTransition,
    useOptimistic,
    useState,
} from "react";
import { ParticipantResponseJson, updateParticipant } from "../fetch";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { twMerge } from "tailwind-merge";
import { Constants, Enums } from "@/database.types";
import { Button } from "@/components/ui/button";
import { TripParticipantStatusIcon } from "./participant-avatars";
import { useI18n } from "@/locales/client";

const participantStatuses = Constants.public.Enums.trip_participant_status;

export function TripParticipantStatusDisplay({
    status,
    showTextValue = true,
}: {
    status: Enums<"trip_participant_status">;
    showTextValue?: boolean;
}) {
    const t = useI18n();
    return (
        <>
            <TripParticipantStatusIcon
                status={status}
                className="w-4 h-4 stroke-3"
                isColorCoded
            />
            {showTextValue &&
                ` ${t(`TripPlanner.participants.status.${status}`)}`}
        </>
    );
}

export default function TripParticipantStatusPicker({
    participant,
    className,
    canEdit = false,
    variant = "standard",
}: {
    participant: ParticipantResponseJson;
    canEdit?: boolean;
    variant?: "standard" | "small";
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
                    <TripParticipantStatusDisplay
                        status={optimisticStatus}
                        showTextValue={variant === "standard"}
                    />
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
