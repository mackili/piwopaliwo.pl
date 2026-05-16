import { Enums } from "@/database.types";
import {
    BusIcon,
    CableCarIcon,
    CarIcon,
    LuggageIcon,
    ShipIcon,
    TrainFrontTunnelIcon,
    TrainTrackIcon,
    TramFrontIcon,
} from "lucide-react";
import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

export default function TransportTypeIcon({
    transportType,
    useColor = true,
    className,
    ...props
}: {
    transportType?: Enums<"transportation_type"> | null;
    useColor?: boolean;
} & ComponentProps<"svg">) {
    let Icon = LuggageIcon;
    switch (transportType) {
        case "bus":
            Icon = BusIcon;
            break;
        case "car":
            Icon = CarIcon;
            break;
        case "ferry":
            Icon = ShipIcon;
            break;
        case "lift":
            Icon = CableCarIcon;
            break;
        case "rail":
            Icon = TrainTrackIcon;
            break;
        case "subway":
            Icon = TrainFrontTunnelIcon;
            break;
        case "tram":
            Icon = TramFrontIcon;
        default:
            Icon = LuggageIcon;
            break;
    }

    return (
        <Icon
            className={twMerge(useColor ? "stroke-accent-2" : "", className)}
            {...props}
        />
    );
}
