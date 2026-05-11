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
import { ChessKingIcon, CrownIcon, User2Icon } from "lucide-react";
import { Button } from "../ui/button";

const participantRoles = Constants.public.Enums.trip_participant_role;

export function TripParticipantRoleDisplay({
    role,
}: {
    role: Enums<"trip_participant_role">;
}) {
    let result = <>{role}</>;
    switch (role) {
        case "admin":
            result = (
                <>
                    <CrownIcon /> Admin
                </>
            );
            break;
        case "member":
            result = (
                <>
                    <User2Icon /> Member
                </>
            );
            break;
        case "owner":
            result = (
                <>
                    <ChessKingIcon /> Owner
                </>
            );
            break;
        default:
            break;
    }
    return <p className="inline-flex items-center gap-1 ">{result}</p>;
}

export default function TripParticipantRolePicker({
    participant,
    className,
    canEdit = false,
}: {
    participant: ParticipantResponseJson;
    canEdit?: boolean;
} & ComponentProps<"select">) {
    const [role, setRole] = useState<Enums<"trip_participant_role">>(
        participant.role,
    );
    const [optimisticRole, setOptimisticRole] =
        useOptimistic<Enums<"trip_participant_role">>(role);
    const handleChange = async (value: Enums<"trip_participant_role">) => {
        startTransition(async () => {
            setOptimisticRole(value);
            const { error } = await updateParticipant(
                { role: value },
                participant.id,
            );
            if (!error) {
                setRole(value);
            }
        });
    };
    return canEdit ? (
        <Select onValueChange={handleChange} defaultValue={optimisticRole}>
            <SelectTrigger
                className={twMerge(
                    "text-primary stroke-primary cursor-pointer",
                    className,
                )}
                value={optimisticRole}
            >
                <SelectValue>
                    <TripParticipantRoleDisplay role={optimisticRole} />
                </SelectValue>
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {participantRoles.map((role, index) => (
                        <SelectItem key={index} value={role}>
                            <TripParticipantRoleDisplay role={role} />
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
            <TripParticipantRoleDisplay role={role} />
        </Button>
    );
}
