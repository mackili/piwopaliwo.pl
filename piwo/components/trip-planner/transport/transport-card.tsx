"use client";

import {
    Card,
    CardAction,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Enums, Tables, TablesInsert } from "@/database.types";
import TransportTypeIcon from "./transport-type-icon";
import DetailField from "@/components/ui/detail-field";
import { useCurrentLocale } from "@/locales/client";
import { permissionsReducer } from "../permissions";
import UpsertTransport, { UpsertTransportVariant } from "./upsert-transport";
import { createContext, useOptimistic, useReducer } from "react";
import { TransportChangeEventType, transportChangeReducer } from "../reducers";
import DeleteTransport from "./delete-transport";
import { TripParticipantsContext } from "../accommodation/accommodation-cards-overview";
import TransportAssignment from "./transport-assignment";
import LinkTransaction from "../cost-planning/link-transaction";
import { TripTransactionStatusPill } from "../icon-factories";

export const TravelAssignedParticipantContext = createContext<string[]>([]);

export default function TransportCard({
    transport,
    currentParticipantRole,
    size = 12,
    potentialParticipants,
}: {
    transport: Tables<"v_trip_travel_summary">;
    currentParticipantRole?: Enums<"trip_participant_role"> | null;
    size?: number;
    potentialParticipants: Tables<"v_trip_participant_details">[];
}) {
    const locale = useCurrentLocale();
    const [transportData, setTransportData] = useReducer(
        transportChangeReducer,
        transport,
    );
    const [optimisticTransportData, setOptimisticTransportData] = useOptimistic(
        transportData,
        transportChangeReducer,
    );
    const handleLinkTransaction = (
        payload: null | {
            id: string;
            description: string;
            total_amount: number | null;
            currency_iso_code: string;
            related_record_id: string | null;
        },
    ) => {
        if (payload) {
            setTransportData({
                type: TransportChangeEventType.TRANSACTION_LINKED,
                payload: payload,
            });
        } else {
            setTransportData({
                type: TransportChangeEventType.TRANSACTION_UNLINKED,
                payload: null,
            });
        }
    };

    return (
        <TripParticipantsContext value={potentialParticipants}>
            <Card>
                <CardHeader>
                    <CardTitle className="flex flex-row gap-4">
                        <div
                            className={`w-${size} h-${size} border-2 border-secondary rounded-full inline-flex items-center justify-center bg-accent/10`}
                        >
                            <TransportTypeIcon
                                transportType={transportData?.mode_of_transport}
                                className="stroke-accent-2"
                            />
                        </div>
                        <div className="space-y-2">
                            <p>{transportData?.name}</p>
                            {transportData?.description && (
                                <p className="text-muted-foreground text-sm font-mono font-normal">
                                    {transportData.description}
                                </p>
                            )}
                        </div>
                    </CardTitle>
                    <CardAction className="gap-1 flex flex-row flex-wrap">
                        {currentParticipantRole &&
                            permissionsReducer({
                                tripParticipantRole: currentParticipantRole,
                                permission: "modify_transport",
                            }) &&
                            transportData && (
                                <>
                                    {permissionsReducer({
                                        tripParticipantRole:
                                            currentParticipantRole,
                                        permission: "plan_budget",
                                    }) && (
                                        <LinkTransaction
                                            tripId={
                                                transportData.trip_id as string
                                            }
                                            transactionId={
                                                transportData?.trip_transaction_id
                                            }
                                            recordId={
                                                transportData.id as string
                                            }
                                            recordType="trip_travel"
                                            onSuccess={handleLinkTransaction}
                                        />
                                    )}
                                    <UpsertTransport
                                        tripId={transportData.trip_id as string}
                                        transport={
                                            transportData as TablesInsert<"trip_travel">
                                        }
                                        variant={UpsertTransportVariant.EDIT}
                                        onSave={setTransportData}
                                    />
                                </>
                            )}
                        {currentParticipantRole &&
                            permissionsReducer({
                                tripParticipantRole: currentParticipantRole,
                                permission: "modify_transport",
                            }) &&
                            transportData?.id && (
                                <DeleteTransport transport={transport} />
                            )}
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-row flex-wrap gap-8 ">
                        {optimisticTransportData?.estimated_departure && (
                            <DetailField
                                detailName="Departure"
                                detailValue={Intl.DateTimeFormat(locale, {
                                    dateStyle: "short",
                                    timeStyle: "short",
                                }).format(
                                    new Date(
                                        optimisticTransportData.estimated_departure,
                                    ),
                                )}
                            />
                        )}
                        {optimisticTransportData?.estimated_arrival && (
                            <>
                                <DetailField
                                    detailName="Arrival"
                                    detailValue={Intl.DateTimeFormat(locale, {
                                        dateStyle: "short",
                                        timeStyle: "short",
                                    }).format(
                                        new Date(
                                            optimisticTransportData.estimated_arrival,
                                        ),
                                    )}
                                />
                                <DetailField
                                    detailName="Duration"
                                    detailValue={new Intl.DurationFormat(
                                        locale,
                                        {
                                            style: "short",
                                        },
                                    ).format({
                                        hours: Math.floor(
                                            (optimisticTransportData?.duration ||
                                                0) / 60,
                                        ),
                                        minutes:
                                            (optimisticTransportData?.duration ||
                                                0) % 60,
                                    })}
                                />
                            </>
                        )}
                        {optimisticTransportData?.capacity && (
                            <DetailField
                                detailName="Capacity"
                                detailValue={String(
                                    optimisticTransportData.capacity,
                                )}
                            />
                        )}
                        {optimisticTransportData?.capacity && (
                            <DetailField
                                detailName="Available Capacity"
                                detailValue={String(
                                    optimisticTransportData.capacity -
                                        ((
                                            optimisticTransportData?.trip_travel_assignments ||
                                            []
                                        )?.length |
                                            0),
                                )}
                            />
                        )}
                        {optimisticTransportData?.trip_travel_assignments && (
                            <DetailField
                                detailName="Assigned Participants"
                                detailValue={String(
                                    optimisticTransportData
                                        ?.trip_travel_assignments?.length,
                                )}
                            />
                        )}
                        {optimisticTransportData?.status && (
                            <DetailField
                                detailName="Status"
                                detailValue={
                                    <TripTransactionStatusPill
                                        status={optimisticTransportData.status}
                                    />
                                }
                            />
                        )}
                    </div>
                </CardContent>
                <CardFooter>
                    <TravelAssignedParticipantContext
                        value={(
                            (transportData?.trip_travel_assignments ||
                                []) as Tables<"v_trip_participant_details">[]
                        )
                            .map((participant) => participant?.id)
                            .filter((id) => id !== null)}
                    >
                        <div className="flex flex-row flex-wrap gap-8">
                            {optimisticTransportData?.id && (
                                <>
                                    {(
                                        (optimisticTransportData?.trip_travel_assignments ||
                                            []) as Tables<"v_trip_participant_details">[]
                                    ).map((assignment) => (
                                        <TransportAssignment
                                            key={assignment?.id}
                                            assignment={assignment}
                                            tripTravelId={
                                                transportData.id as string
                                            }
                                            onChange={setTransportData}
                                            optimisticOnChange={
                                                setOptimisticTransportData
                                            }
                                        />
                                    ))}
                                    {(!transport?.capacity ||
                                        (transport?.capacity &&
                                            optimisticTransportData?.trip_travel_assignments &&
                                            transport.capacity >
                                                optimisticTransportData
                                                    .trip_travel_assignments
                                                    .length)) && (
                                        <TransportAssignment
                                            tripTravelId={
                                                optimisticTransportData.id
                                            }
                                            onChange={setTransportData}
                                            optimisticOnChange={
                                                setOptimisticTransportData
                                            }
                                        />
                                    )}
                                </>
                            )}
                        </div>
                    </TravelAssignedParticipantContext>
                </CardFooter>
            </Card>
        </TripParticipantsContext>
    );
}
