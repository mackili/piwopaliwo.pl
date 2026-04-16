import { Tables } from "@/database.types";
import {
    ArchiveIcon,
    Building2Icon,
    CableCarIcon,
    CaravanIcon,
    CheckCircle2Icon,
    KayakIcon,
    LightbulbIcon,
    MountainSnowIcon,
    PlaneIcon,
    SailboatIcon,
    XCircleIcon,
} from "lucide-react";
export function TripIcon({ tripType }: { tripType: Tables<"trip">["type"] }) {
    switch (tripType) {
        case "caravaning":
            return <CaravanIcon />;
        case "citybreak":
            return <Building2Icon />;
        case "cayaking":
            return <KayakIcon />;
        case "hiking":
            return <MountainSnowIcon />;
        case "sailing":
            return <SailboatIcon />;
        case "skiing":
            return <CableCarIcon />;
        default:
            return <PlaneIcon />;
    }
}

export function tripStatusColor(tripStatus: Tables<"trip">["status"]) {
    switch (tripStatus) {
        case "cancelled":
            return "stroke-red-700";
        case "confirmed":
            return "stroke-green-600";
        case "proposed":
            return "stroke-yellow-500";
        default:
            return undefined;
    }
}

export function TripStatus({
    tripStatus,
}: {
    tripStatus: Tables<"trip">["status"];
}) {
    const color = tripStatusColor(tripStatus);
    switch (tripStatus) {
        case "cancelled":
            return <XCircleIcon className={color} />;
        case "confirmed":
            return <CheckCircle2Icon className={color} />;
        case "past":
            return <ArchiveIcon />;
        case "proposed":
            return <LightbulbIcon className={color} />;
        default:
            return <></>;
    }
}
