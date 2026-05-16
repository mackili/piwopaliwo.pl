import { Enums, Tables } from "@/database.types";
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
    ReceiptEuroIcon,
    UtensilsIcon,
    CarIcon,
    FuelIcon,
    BedIcon,
    ActivityIcon,
    MoreHorizontalIcon,
} from "lucide-react";
import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";
import { Badge } from "../ui/badge";
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

export function TripTransactionCategoryIcon({
    category,
    className,
    ...props
}: {
    category: Enums<"trip_transaction_category">;
} & ComponentProps<"div">) {
    let icon = <ReceiptEuroIcon className="stroke-gray-600 stroke-1" />;
    let classString = "bg-gray-400";
    switch (category) {
        case "food":
            icon = <UtensilsIcon className="stroke-red-600 stroke-1" />;
            classString = "bg-red-200";
            break;
        case "transport":
            icon = <CarIcon className="stroke-blue-600 stroke-1" />;
            classString = "bg-blue-200";
            break;
        case "fuel":
            icon = <FuelIcon className="stroke-orange-600 stroke-1" />;
            classString = "bg-orange-200";
            break;
        case "stay":
            icon = <BedIcon className="stroke-green-600 stroke-1" />;
            classString = "bg-green-200";
            break;
        case "activity":
            icon = <ActivityIcon className="stroke-purple-600 stroke-1" />;
            classString = "bg-purple-200";
            break;
        case "other":
            icon = <MoreHorizontalIcon className="stroke-gray-600 stroke-1" />;
            classString = "bg-gray-200";
            break;
        default:
            break;
    }
    return (
        <div
            className={twMerge(
                "aspect-square rounded-md w-8 h-8 flex items-center justify-center",
                classString,
                className,
            )}
            {...props}
        >
            {icon}
        </div>
    );
}

export function TripTransactionStatusPill({
    status,
    className,
    ...props
}: { status: Enums<"transaction_status"> } & ComponentProps<"div">) {
    let classString = "bg-gray-200 text-gray-600 border-gray-300";
    switch (status) {
        case "idea":
            classString = "bg-blue-100 text-blue-600 border-blue-300";
            break;
        case "quoted":
            classString = "bg-yellow-100 text-yellow-600 border-yellow-300";
            break;
        case "committed":
            classString = "bg-green-100 text-green-600 border-green-300";
            break;
        case "paid":
            classString = "bg-teal-100 text-teal-600 border-teal-300";
            break;
        default:
            break;
    }

    return (
        <Badge
            className={twMerge("uppercase", classString, className)}
            {...props}
        >
            {status}
        </Badge>
    );
}
