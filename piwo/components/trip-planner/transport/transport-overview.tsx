import PostgrestErrorDisplay from "@/components/ui/postgrest-error-display";
import {
    fetchCurrentTripParticipant,
    fetchTripParticipantDetails,
    fetchTripTransportSummary,
} from "../fetch";
import { getCurrentLocale } from "@/locales/server";
import TransportCard from "./transport-card";
import { permissionsReducer } from "../permissions";
import UpsertTransport from "./upsert-transport";

export default async function TransportOverview({
    tripId,
}: {
    tripId: string;
}) {
    const [
        locale,
        { data, error },
        { data: currentTripParticipant },
        { data: potentialParticipants },
    ] = await Promise.all([
        getCurrentLocale(),
        fetchTripTransportSummary(tripId),
        fetchCurrentTripParticipant(tripId),
        fetchTripParticipantDetails(tripId, [
            "confirmed",
            "invited",
            "tentative",
        ]),
    ]);
    return (
        <div className="space-y-4">
            <div className="flex flex-row flex-wrap justify-between gap-4">
                <div className="space-y-2">
                    <p className="font-serif text-2xl font-bold">Transport</p>
                    <p className="text-muted-foreground text-sm">
                        Getting there and around
                    </p>
                </div>
                <div className="flex flex-row flex-wrap gap-4"></div>
            </div>
            <div className="space-y-4">
                <PostgrestErrorDisplay error={error} />
                {data?.map((travel, index) => (
                    <>
                        <TransportCard
                            transport={travel}
                            key={travel.id}
                            currentParticipantRole={
                                currentTripParticipant?.role
                            }
                            potentialParticipants={potentialParticipants || []}
                        />
                    </>
                ))}
                {currentTripParticipant?.role &&
                    permissionsReducer({
                        tripParticipantRole: currentTripParticipant.role,
                        permission: "modify_transport",
                    }) && <UpsertTransport tripId={tripId} />}
            </div>
        </div>
    );
}
