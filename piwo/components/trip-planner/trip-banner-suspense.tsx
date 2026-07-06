import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDaysIcon, Dot, MapPinIcon } from "lucide-react";
import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";
import { Skeleton } from "../ui/skeleton";

export default function TripBannerSuspense({
    className,
    ...props
}: ComponentProps<"div">) {
    return (
        <Card
            {...props}
            className={twMerge(
                "bg-linear-to-br/shorter from-accent-2 to-accent",
                className,
            )}
        >
            <CardHeader className="flex flex-wrap justify-between flex-col-reverse sm:flex-row gap-4">
                <div className="flex flex-row flex-wrap gap-2">
                    <Badge
                        variant="glass"
                        className="text-secondary animate-pulse"
                    >
                        <MapPinIcon />
                        <div className="w-20 h-4" />
                    </Badge>
                    <Badge
                        variant="glass"
                        className="text-secondary animate-pulse"
                    >
                        <CalendarDaysIcon />
                        <div className="w-20 h-4" />
                        <Dot />
                        <div className="w-20 h-4" />
                    </Badge>
                </div>
                <CardAction>
                    <Skeleton className="w-54 h-9" />
                </CardAction>
            </CardHeader>
            <CardContent className="flex flex-row flex-wrap gap-8 justify-between">
                <div className="flex flex-col gap-4">
                    <CardTitle className="font-serif text-secondary text-5xl font-extrabold">
                        <Skeleton className="w-80 h-12" />
                    </CardTitle>
                    <CardDescription className="text-secondary font-medium text-lg">
                        <Skeleton className="w-80 h-7" />
                    </CardDescription>
                </div>
                <div>
                    <div className="flex flex-row -space-x-2">
                        <Skeleton className="rounded-full h-10 w-10" />
                        <Skeleton className="rounded-full h-10 w-10" />
                        <Skeleton className="rounded-full h-10 w-10" />
                        <Skeleton className="rounded-full h-10 w-10" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
