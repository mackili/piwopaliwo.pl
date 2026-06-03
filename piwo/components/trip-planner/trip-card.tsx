import { Tables } from "@/database.types";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ArrowRightIcon, CalendarDaysIcon } from "lucide-react";
import { getCurrentLocale } from "@/locales/server";
import { TripIcon, TripStatus } from "./icon-factories";
import Link from "next/link";

export default async function TripCard({ trip }: { trip: Tables<"trip"> }) {
    const locale = await getCurrentLocale();
    return (
        <Link href={`/${locale}/apps/trip-planner/${trip.slug}/overview`}>
            <Card>
                <CardHeader>
                    <CardTitle>{trip.name}</CardTitle>
                    <CardAction className="flex flex-row gap-2 flex-wrap">
                        <TripStatus tripStatus={trip.status} />
                        <TripIcon tripType={trip.type} />
                    </CardAction>
                </CardHeader>
                {trip?.description && (
                    <CardContent>
                        <CardDescription className="text-primary">
                            {trip.description}
                        </CardDescription>
                    </CardContent>
                )}
                <CardFooter>
                    <CardDescription>
                        <ul>
                            <li className="flex flex-row gap-2 items-center flex-wrap text-primary">
                                <CalendarDaysIcon />
                                {new Intl.DateTimeFormat(locale).format(
                                    new Date(trip.start_date),
                                )}
                                <ArrowRightIcon />{" "}
                                {new Intl.DateTimeFormat(locale).format(
                                    new Date(trip.end_date),
                                )}
                            </li>
                        </ul>
                    </CardDescription>
                </CardFooter>
            </Card>
        </Link>
    );
}
