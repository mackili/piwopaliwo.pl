"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tables } from "@/database.types";
import { useCurrentLocale } from "@/locales/client";

function TripAccommodationDetail({
    detailName,
    detailValue,
}: {
    detailName: string;
    detailValue: string;
}) {
    return (
        <div className="space-y-1">
            <p className="font-medium text-xs text-muted-foreground">
                {detailName}
            </p>
            <p className="font-semibold text-sm text-primary">{detailValue}</p>
        </div>
    );
}

export default function TripAccommodationCard({
    accommodation,
}: {
    accommodation: Tables<"v_trip_accommodation_summary">;
}) {
    const locale = useCurrentLocale();
    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <p>{accommodation.name}</p>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="w-full pb-4 flex flex-row flex-wrap gap-4 border-b border-muted">
                    {accommodation?.check_in_date && (
                        <TripAccommodationDetail
                            detailName="Check-in"
                            detailValue={Intl.DateTimeFormat(locale).format(
                                new Date(accommodation.check_in_date),
                            )}
                        />
                    )}
                    {accommodation?.check_out_date && (
                        <TripAccommodationDetail
                            detailName="Check-out"
                            detailValue={Intl.DateTimeFormat(locale).format(
                                new Date(accommodation.check_out_date),
                            )}
                        />
                    )}
                    {accommodation?.stay_duration_days && (
                        <TripAccommodationDetail
                            detailName="Nights"
                            detailValue={String(
                                accommodation.stay_duration_days,
                            )}
                        />
                    )}
                    {/* {accommodation?.total && (
                        <TripAccommodationDetail
                            detailName="Total"
                            detailValue={accommodation.total}
                        />
                    )} */}
                </div>
                <div className="pt-4">
                    <div className="font-semibold">
                        <p>Rooms</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
