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
import { useMemo } from "react";
import {
    AccommodationModificationChangeAction,
    AccommodationModificationSplitChangeEventType,
    calculateAccommodationTotalCapacity,
    calculateAccommodationUsedCapacity,
} from "../reducers";
import { Tables } from "@/database.types";
import { permissionsReducer } from "../permissions";
import UpsertAccommodation, {
    UpsertAccommodationVariant,
} from "./upsert-accommodation";
import DeleteAccommodation from "./delete-accommodation";
import DetailField from "@/components/ui/detail-field";
import LinkTransaction from "../cost-planning/link-transaction";
import { TripTransactionStatusPill } from "../icon-factories";

export default function TripAccommodationCard({
    accommodationData,
    currentTripParticipant,
    setAccommodationData,
    setOptimisticAccommodationData,
}: {
    accommodationData: TripAccommodationSummaryView;
    currentTripParticipant: Tables<"v_trip_participant_details">;
    setAccommodationData: (
        action: AccommodationModificationChangeAction,
    ) => void;
    setOptimisticAccommodationData: (
        action: AccommodationModificationChangeAction,
    ) => void;
}) {
    const locale = useCurrentLocale();
    const [totalCapacity, usedCapacity] = useMemo(
        () => [
            calculateAccommodationTotalCapacity(
                accommodationData.accommodation_units,
            ),
            calculateAccommodationUsedCapacity(
                accommodationData.accommodation_units,
            ),
        ],
        [accommodationData.accommodation_units],
    );
    const handleTransactionLinkUnlink = (
        payload: null | {
            id: string;
            description: string;
            total_amount: number | null;
            currency_iso_code: string;
            related_record_id: string | null;
        },
    ) => {
        if (payload) {
            setAccommodationData({
                type: AccommodationModificationSplitChangeEventType.TRANSACTION_LINKED,
                payload: payload,
            });
        } else {
            if (accommodationData?.id) {
                setAccommodationData({
                    type: AccommodationModificationSplitChangeEventType.TRANSACTION_UNLINKED,
                    payload: accommodationData.id,
                });
            }
        }
    };
    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <p>{accommodationData.name}</p>
                </CardTitle>
                <CardAction className="gap-1 flex flex-row flex-wrap">
                    {accommodationData &&
                        accommodationData?.trip_id &&
                        currentTripParticipant?.role &&
                        permissionsReducer({
                            tripParticipantRole: currentTripParticipant.role,
                            permission: "modify_accommodation",
                        }) && (
                            <>
                                {permissionsReducer({
                                    tripParticipantRole:
                                        currentTripParticipant.role,
                                    permission: "plan_budget",
                                }) &&
                                    accommodationData?.trip_id &&
                                    accommodationData?.id && (
                                        <LinkTransaction
                                            tripId={accommodationData.trip_id}
                                            recordId={accommodationData.id}
                                            recordType="accommodation"
                                            transactionId={
                                                accommodationData.trip_transaction_id
                                            }
                                            onSuccess={
                                                handleTransactionLinkUnlink
                                            }
                                        />
                                    )}
                                <UpsertAccommodation
                                    variant={UpsertAccommodationVariant.EDIT}
                                    tripId={accommodationData.trip_id}
                                    accommodation={accommodationData}
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
                        <DetailField
                            detailName="Status"
                            detailValue={
                                <TripTransactionStatusPill
                                    status={accommodationData.status}
                                />
                            }
                        />
                    )}
                    {accommodationData?.check_in_date && (
                        <DetailField
                            detailName="Check-in"
                            detailValue={Intl.DateTimeFormat(locale).format(
                                new Date(accommodationData.check_in_date),
                            )}
                        />
                    )}
                    {accommodationData?.check_out_date && (
                        <DetailField
                            detailName="Check-out"
                            detailValue={Intl.DateTimeFormat(locale).format(
                                new Date(accommodationData.check_out_date),
                            )}
                        />
                    )}
                    {accommodationData?.stay_duration_days && (
                        <DetailField
                            detailName="Nights"
                            detailValue={String(
                                accommodationData.stay_duration_days,
                            )}
                        />
                    )}
                    <DetailField
                        detailName="Capacity"
                        detailValue={String(totalCapacity)}
                    />
                    <DetailField
                        detailName="Capacity Used"
                        detailValue={String(usedCapacity)}
                    />
                    <DetailField
                        detailName="Capacity Available"
                        detailValue={String(totalCapacity - usedCapacity)}
                    />
                    {accommodationData?.total_amount &&
                        accommodationData?.currency_iso_code && (
                            <DetailField
                                detailName="Total Amount"
                                detailValue={Intl.NumberFormat(locale, {
                                    style: "currency",
                                    currency:
                                        accommodationData.currency_iso_code,
                                }).format(accommodationData.total_amount)}
                            />
                        )}
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
                                        onOptimisticAccommodationUnitChange={
                                            setOptimisticAccommodationData
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
