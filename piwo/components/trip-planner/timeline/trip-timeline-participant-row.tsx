"use client";

import { Tables } from "@/database.types";
import { useUserHighlight } from "./user-highlight-provider";
import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";
import { ParticipantRow } from "../transport/transport-assignment";

export function TripTimelineParticipantRow({
    detail,
    className,
    ...props
}: { detail: Tables<"v_trip_participant_details"> } & ComponentProps<"div">) {
    const { highlightedUsers } = useUserHighlight();
    const highlightClasses =
        highlightedUsers &&
        detail?.user_id &&
        highlightedUsers.includes(detail.user_id)
            ? "outline-1 outline-offset-4 outline-accent rounded-xl"
            : "";
    return (
        <ParticipantRow
            participant={detail}
            className={twMerge(highlightClasses, className)}
            {...props}
        />
    );
}
