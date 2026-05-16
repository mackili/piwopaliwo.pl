import {
    Card,
    CardAction,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { TripAccommodationUnitSummary } from "../custom-schemas";
import UpsertAccommodationUnit, {
    UpsertAccommodationUnitVariant,
} from "./upsert-accommodation-unit";
import { AccommodationModificationChangeAction } from "../reducers";
import DeleteAccommodationUnit from "./delete-accommodation-unit";
import { Enums } from "@/database.types";
import { permissionsReducer } from "../permissions";
import AccommodationUnitAssignment from "./accommodation-unit-assignment";

export default function AccommodationUnitCard({
    accommodationUnit,
    onAccommodationUnitChange,
    currentParticipantRole,
}: {
    accommodationUnit: TripAccommodationUnitSummary;
    onAccommodationUnitChange: (
        action: AccommodationModificationChangeAction,
    ) => void;
    currentParticipantRole: Enums<"trip_participant_role">;
}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="inline-flex gap-2 flex-wrap">
                    {accommodationUnit.name}
                    <span className="font-light text-muted-foreground">
                        {`(${accommodationUnit.assigned_participants}/${accommodationUnit.capacity})`}
                    </span>
                </CardTitle>
                <CardAction className="flex gap-1 flex-wrap flex-row">
                    {accommodationUnit?.accommodation_id &&
                        permissionsReducer({
                            tripParticipantRole: currentParticipantRole,
                            permission: "modify_accommodation",
                        }) && (
                            <UpsertAccommodationUnit
                                accommodationId={
                                    accommodationUnit.accommodation_id
                                }
                                accommodationUnit={accommodationUnit}
                                variant={UpsertAccommodationUnitVariant.EDIT}
                                onSave={onAccommodationUnitChange}
                            />
                        )}
                    {permissionsReducer({
                        tripParticipantRole: currentParticipantRole,
                        permission: "modify_accommodation",
                    }) && (
                        <DeleteAccommodationUnit
                            accommodationUnit={accommodationUnit}
                            onSave={onAccommodationUnitChange}
                        />
                    )}
                </CardAction>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-4">
                    {accommodationUnit.assignments.map((assignment, index) => (
                        <AccommodationUnitAssignment
                            key={index}
                            assignment={assignment}
                            accommodationUnitId={accommodationUnit.id}
                            onChange={onAccommodationUnitChange}
                        />
                    ))}
                    {permissionsReducer({
                        tripParticipantRole: currentParticipantRole,
                        permission: "assign_accommodation",
                    }) &&
                        accommodationUnit.capacity &&
                        accommodationUnit.assigned_participants <
                            accommodationUnit?.capacity && (
                            <AccommodationUnitAssignment
                                accommodationUnitId={accommodationUnit.id}
                                onChange={onAccommodationUnitChange}
                            />
                        )}
                </div>
            </CardContent>
        </Card>
    );
}
