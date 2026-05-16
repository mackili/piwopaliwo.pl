"use client";

import TripAccommodationCard from "./accommodation-card";
import { TripAccommodationSummaryView } from "../custom-schemas";
import { Tables } from "@/database.types";
import { createContext, useReducer } from "react";
import { accommodationModificationReducer } from "../reducers";

export const TripParticipantsContext = createContext<
    Tables<"v_trip_participant_details">[]
>([]);

export default function TripAccommodationCardsOverview({
    accommodations,
    currentTripParticipant,
    potentialParticipants,
}: {
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
    return (
        <TripParticipantsContext value={potentialParticipants}>
            {currentTripParticipant &&
                accommodationData?.map((accommodation, index) => (
                    <TripAccommodationCard
                        key={index}
                        accommodationData={accommodation}
                        currentTripParticipant={currentTripParticipant}
                        setAccommodationData={setAccommodationData}
                    />
                ))}
        </TripParticipantsContext>
    );
}
