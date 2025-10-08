"use client";
import {
    BanIcon,
    CheckIcon,
    CircleDashedIcon,
    CircleQuestionMarkIcon,
    LucideIcon,
    SaveOffIcon,
} from "lucide-react";
import { useMemo } from "react";
export type SaveStatusEnum =
    | "saved"
    | "pending"
    | "unsaved"
    | "error"
    | "unknown";

function Icon({ iconNode: IconComponent }: { iconNode: LucideIcon }) {
    return <IconComponent />;
}

export default function SaveIcon({
    saveStatus,
}: {
    saveStatus: SaveStatusEnum;
}) {
    let icon: LucideIcon;
    switch (saveStatus) {
        case "error":
            icon = BanIcon;
            break;
        case "pending":
            icon = CircleDashedIcon;
            break;
        case "saved":
            icon = CheckIcon;
            break;
        case "unsaved":
            icon = SaveOffIcon;
            break;
        default:
            icon = CircleQuestionMarkIcon;
            break;
    }
    return <Icon iconNode={icon} />;
}
