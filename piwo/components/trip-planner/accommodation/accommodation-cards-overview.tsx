"use client";

import TripAccommodationCard from "./accommodation-card";
import { TripAccommodationSummaryView } from "../custom-schemas";
import { Tables } from "@/database.types";
import { createContext, useOptimistic, useReducer } from "react";
import { accommodationModificationReducer } from "../reducers";
import UpsertAccommodation from "./upsert-accommodation";

export const TripParticipantsContext = createContext<
    Tables<"v_trip_participant_details">[]
>([]);

export default function TripAccommodationCardsOverview({
    tripId,
    accommodations,
    currentTripParticipant,
    potentialParticipants,
}: {
    tripId: string;
    accommodations: TripAccommodationSummaryView[];
    currentTripParticipant: Tables<"v_trip_participant_details">;
    potentialParticipants: Tables<"v_trip_participant_details">[];
}) {
    const [accommodationData, setAccommodationData] = useReducer(
        accommodationModificationReducer,
        accommodations.map((accommodation) => ({
            ...accommodation,
            accommodation_units: accommodation.accommodation_units
                .map((unit) => ({
                    ...unit,
                    assignments: unit.assignments.sort((a, b) =>
                        (b?.nickname || b?.last_name || "") >
                        (a.nickname || a?.last_name || "")
                            ? -1
                            : (b?.nickname || b?.last_name || "") <
                                (a.nickname || a?.last_name || "")
                              ? 1
                              : 0,
                    ),
                }))
                .sort((a, b) =>
                    b.name > a.name ? -1 : b.name < a.name ? 1 : 0,
                ),
            totalCapacity: 0,
            usedCapacity: 0,
        })),
    );
    const [optimisticAccommodationData, setOptimisticAccommodationData] =
        useOptimistic(accommodationData, accommodationModificationReducer);
    return (
        <TripParticipantsContext value={potentialParticipants}>
            {currentTripParticipant &&
                optimisticAccommodationData?.map((accommodation) => (
                    <TripAccommodationCard
                        key={accommodation.id}
                        accommodationData={accommodation}
                        currentTripParticipant={currentTripParticipant}
                        setAccommodationData={setAccommodationData}
                        setOptimisticAccommodationData={
                            setOptimisticAccommodationData
                        }
                    />
                ))}
            <UpsertAccommodation
                tripId={tripId}
                onSave={setAccommodationData}
            />
        </TripParticipantsContext>
    );
}
