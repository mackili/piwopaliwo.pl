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

export default function TransportTypeIcon({
    transportType,
    ...props
}: {
    transportType?: Enums<"transportation_type"> | null;
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

    return <Icon {...props} />;
}
