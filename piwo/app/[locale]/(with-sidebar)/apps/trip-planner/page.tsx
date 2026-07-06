import EditTripForm from "@/components/trip-planner/edit-trip";
import { fetchTrips } from "@/components/trip-planner/fetch";
import TripCard from "@/components/trip-planner/trip-card";
import {
    Card,
    CardAction,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { TablesInsert } from "@/database.types";
import { getI18n } from "@/locales/server";

export default async function Page() {
    const [data, t] = await Promise.all([fetchTrips(), getI18n()]);

    return (
        <div className="grid grid-cols-1 gap-4 p-4">
            {data.data
                ?.filter((group) => group.trips.length > 0)
                .map((group) => (
                    <Card key={group.id}>
                        <CardHeader>
                            <CardTitle>{group.name}</CardTitle>
                            <CardAction>
                                <EditTripForm
                                    displayMode="dialog"
                                    title={t("TripPlanner.newTrip")}
                                    isEdit={false}
                                    trip={
                                        {
                                            group_id: group.id,
                                        } as TablesInsert<"trip">
                                    }
                                />
                            </CardAction>
                        </CardHeader>
                        <CardContent className="@container">
                            <div className="grid @max-sm:grid-cols-1 @max-md:grid-cols-2 @max-4xl:grid-cols-3 grid-cols-4 gap-4">
                                {group.trips.map((trip) => (
                                    <TripCard key={trip.id} trip={trip} />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
        </div>
    );
}
