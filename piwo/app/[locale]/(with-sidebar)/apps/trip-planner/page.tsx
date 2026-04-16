import { fetchTrips } from "@/components/trip-planner/fetch";
import TripCard from "@/components/trip-planner/trip-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function Page() {
    const data = await fetchTrips();

    return (
        <div className="grid grid-cols-1 gap-4">
            {data.data
                ?.filter((group) => group.trips.length > 0)
                .map((group) => (
                    <Card key={group.id}>
                        <CardHeader>
                            <CardTitle>{group.name}</CardTitle>
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
