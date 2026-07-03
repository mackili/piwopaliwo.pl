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
import { Constants, Database } from "@/database.types";
import { CrownIcon, EditIcon, ViewIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const participantRoles = Constants.permissions.Enums.user_role;

export function TripParticipantRoleDisplay({
    role,
}: {
    role: Database["permissions"]["Enums"]["user_role"];
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
        case "editor":
            result = (
                <>
                    <EditIcon /> Member
                </>
            );
            break;
        case "viewer":
            result = (
                <>
                    <ViewIcon /> Viewer
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
    const [role, setRole] = useState<
        Database["permissions"]["Enums"]["user_role"]
    >(participant.role);
    const [optimisticRole, setOptimisticRole] =
        useOptimistic<Database["permissions"]["Enums"]["user_role"]>(role);
    const handleChange = async (
        value: Database["permissions"]["Enums"]["user_role"],
    ) => {
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
