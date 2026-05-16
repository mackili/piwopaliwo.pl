"use client";
import {
    Card,
    CardAction,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useCurrentLocale } from "@/locales/client";
import UpsertAccommodationUnit from "./upsert-accommodation-unit";
import { TripAccommodationSummaryView } from "../custom-schemas";
import AccommodationUnitCard from "./accommodation-unit-card";
import { useMemo, useReducer } from "react";
import {
    accommodationModificationReducer,
    calculateAccommodationTotalCapacity,
    calculateAccommodationUsedCapacity,
} from "../reducers";
import { Tables } from "@/database.types";
import { permissionsReducer } from "../permissions";
import UpsertAccommodation, {
    UpsertAccommodationVariant,
} from "./upsert-accommodation";
import DeleteAccommodation from "./delete-accommodation";

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
    currentTripParticipant,
}: {
    accommodation: TripAccommodationSummaryView;
    currentTripParticipant: Tables<"v_trip_participant_details">;
}) {
    const locale = useCurrentLocale();
    const [totalCapacity, usedCapacity] = useMemo(
        () => [
            calculateAccommodationTotalCapacity(
                accommodation.accommodation_units,
            ),
            calculateAccommodationUsedCapacity(
                accommodation.accommodation_units,
            ),
        ],
        [accommodation.accommodation_units],
    );
    const [accommodationData, setAccommodationData] = useReducer(
        accommodationModificationReducer,
        {
            ...accommodation,
            totalCapacity: totalCapacity,
            usedCapacity: usedCapacity,
        },
    );
    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <p>{accommodationData.name}</p>
                </CardTitle>
                <CardAction className="gap-1 flex flex-row flex-wrap">
                    {accommodation &&
                        accommodation?.trip_id &&
                        currentTripParticipant?.role &&
                        permissionsReducer({
                            tripParticipantRole: currentTripParticipant.role,
                            permission: "modify_accommodation",
                        }) && (
                            <>
                                <UpsertAccommodation
                                    variant={UpsertAccommodationVariant.EDIT}
                                    tripId={accommodation.trip_id}
                                    accommodation={accommodation}
                                    onSave={setAccommodationData}
                                />
                                <DeleteAccommodation
                                    accommodation={accommodationData}
                                    onSave={setAccommodationData}
                                />
                            </>
                        )}
                </CardAction>
            </CardHeader>
            <CardContent>
                <div className="w-full pb-4 flex flex-row flex-wrap gap-8 border-b border-muted">
                    {accommodationData?.status && (
                        <TripAccommodationDetail
                            detailName="Status"
                            detailValue={accommodationData.status}
                        />
                    )}
                    {accommodationData?.check_in_date && (
                        <TripAccommodationDetail
                            detailName="Check-in"
                            detailValue={Intl.DateTimeFormat(locale).format(
                                new Date(accommodationData.check_in_date),
                            )}
                        />
                    )}
                    {accommodationData?.check_out_date && (
                        <TripAccommodationDetail
                            detailName="Check-out"
                            detailValue={Intl.DateTimeFormat(locale).format(
                                new Date(accommodationData.check_out_date),
                            )}
                        />
                    )}
                    {accommodationData?.stay_duration_days && (
                        <TripAccommodationDetail
                            detailName="Nights"
                            detailValue={String(
                                accommodationData.stay_duration_days,
                            )}
                        />
                    )}
                    <TripAccommodationDetail
                        detailName="Capacity"
                        detailValue={String(accommodationData.totalCapacity)}
                    />
                    <TripAccommodationDetail
                        detailName="Capacity Used"
                        detailValue={String(accommodationData.usedCapacity)}
                    />
                    <TripAccommodationDetail
                        detailName="Capacity Available"
                        detailValue={String(
                            accommodationData.totalCapacity -
                                accommodationData.usedCapacity,
                        )}
                    />
                    {/* {accommodation?.total && (
                        <TripAccommodationDetail
                            detailName="Total"
                            detailValue={accommodation.total}
                        />
                    )} */}
                </div>
                <div className="pt-4 space-y-4 @container">
                    <div className="font-semibold">
                        <p>Rooms</p>
                    </div>
                    <div className="grid @md:grid-cols-2 @2xl:grid-cols-3 @5xl:grid-cols-4 gap-2 min-h-32">
                        {accommodationData?.accommodation_units?.map(
                            (accommodationUnit) =>
                                currentTripParticipant?.role && (
                                    <AccommodationUnitCard
                                        key={accommodationUnit.id}
                                        accommodationUnit={accommodationUnit}
                                        onAccommodationUnitChange={
                                            setAccommodationData
                                        }
                                        currentParticipantRole={
                                            currentTripParticipant.role
                                        }
                                    />
                                ),
                        )}
                        {accommodationData?.id &&
                            currentTripParticipant?.role &&
                            permissionsReducer({
                                tripParticipantRole:
                                    currentTripParticipant.role,
                                permission: "modify_accommodation",
                            }) && (
                                <UpsertAccommodationUnit
                                    accommodationId={accommodationData.id}
                                    onSave={setAccommodationData}
                                />
                            )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
