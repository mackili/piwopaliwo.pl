import { Database } from "@/database.types";
import {
    Card,
    CardAction,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../ui/card";
import { twMerge } from "tailwind-merge";
import { ClockIcon } from "lucide-react";

function getDayDifference(date1: Date, date2: Date) {
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

export default function TripCountdown({
    startDate,
    ...props
}: {
    startDate: Database["public"]["Views"]["v_trip_details"]["Row"]["start_date"];
} & React.ComponentProps<"div">) {
    const daysUntil = startDate
        ? Math.max(0, getDayDifference(new Date(startDate), new Date()))
        : "?";
    return (
        <Card {...props} className={twMerge(props.className, "min-w-64")}>
            <CardHeader>
                <CardTitle>Countdown</CardTitle>
                <CardAction>
                    <ClockIcon className="stroke-accent" />
                </CardAction>
            </CardHeader>
            <CardContent className="text-accent">
                <h2 className="uppercase">{daysUntil} days</h2>
            </CardContent>
            <CardFooter className="uppercase">
                <p>Until start</p>
            </CardFooter>
        </Card>
    );
}
