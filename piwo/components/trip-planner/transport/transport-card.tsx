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
import { createContext, useReducer } from "react";
import { transportChangeReducer } from "../reducers";
import DeleteTransport from "./delete-transport";
import { TripParticipantsContext } from "../accommodation/accommodation-cards-overview";
import TransportAssignment from "./transport-assignment";

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

    return (
        <TripParticipantsContext value={potentialParticipants}>
            <Card>
                <CardHeader>
                    <CardTitle className="flex flex-row gap-4">
                        <div
                            className={`w-${size} h-${size} border-2 border-secondary rounded-full inline-flex items-center justify-center`}
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
                                <UpsertTransport
                                    tripId={transportData.trip_id as string}
                                    transport={
                                        transportData as TablesInsert<"trip_travel">
                                    }
                                    variant={UpsertTransportVariant.EDIT}
                                    onSave={setTransportData}
                                />
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
                        {transportData?.estimated_departure && (
                            <DetailField
                                detailName="Departure"
                                detailValue={Intl.DateTimeFormat(locale, {
                                    dateStyle: "short",
                                    timeStyle: "short",
                                }).format(
                                    new Date(transportData.estimated_departure),
                                )}
                            />
                        )}
                        {transportData?.estimated_arrival && (
                            <>
                                <DetailField
                                    detailName="Arrival"
                                    detailValue={Intl.DateTimeFormat(locale, {
                                        dateStyle: "short",
                                        timeStyle: "short",
                                    }).format(
                                        new Date(
                                            transportData.estimated_arrival,
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
                                            (transportData?.duration || 0) / 60,
                                        ),
                                        minutes:
                                            (transportData?.duration || 0) % 60,
                                    })}
                                />
                            </>
                        )}
                        {transportData?.capacity && (
                            <DetailField
                                detailName="Capacity"
                                detailValue={String(transportData.capacity)}
                            />
                        )}
                        {transportData?.status && (
                            <DetailField
                                detailName="Status"
                                detailValue={transportData.status}
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
                            {transportData?.id && (
                                <>
                                    {(
                                        (transportData?.trip_travel_assignments ||
                                            []) as Tables<"v_trip_participant_details">[]
                                    ).map((assignment, index) => (
                                        <TransportAssignment
                                            key={index}
                                            assignment={assignment}
                                            tripTravelId={
                                                transportData.id as string
                                            }
                                            onChange={setTransportData}
                                        />
                                    ))}
                                    {(!transport?.capacity ||
                                        (transport?.capacity &&
                                            transport?.trip_travel_assignments &&
                                            transport.capacity >
                                                transport
                                                    .trip_travel_assignments
                                                    .length)) && (
                                        <TransportAssignment
                                            tripTravelId={transportData.id}
                                            onChange={setTransportData}
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
