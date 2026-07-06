import EditTripForm from "@/components/trip-planner/edit-trip";
import { fetchTrips } from "@/components/trip-planner/fetch";
import UpsertGroup from "@/components/trip-planner/groups/upsert-group";
import TripCard from "@/components/trip-planner/trip-card";
import { ButtonGroup } from "@/components/ui/button-group";
import {
    Card,
    CardAction,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import PostgrestErrorDisplay from "@/components/ui/postgrest-error-display";
import { TablesInsert } from "@/database.types";
import { getI18n } from "@/locales/server";
import { createClient } from "@/utils/supabase/server";
import GroupDetailsLink from "./group-details-link";

export default async function GroupTrips() {
    const [{ data, error }, t, supabase] = await Promise.all([
        fetchTrips(),
        getI18n(),
        createClient(),
    ]);
    const { data: claims } = await supabase.auth.getClaims();
    return (
        <>
            <PostgrestErrorDisplay error={error} />
            {data?.map((group) => (
                <Card
                    key={group.id}
                    className="relative"
                    // className={`bg-[url(${group?.thumbnail_url})]`}
                >
                    <div
                        style={{
                            backgroundImage: `url(${group?.thumbnail_url})`,
                        }}
                        className="bg-cover bg-center absolute inset-0 opacity-40"
                    ></div>
                    <CardHeader className="z-10 flex flex-wrap justify-between flex-col-reverse sm:flex-row gap-4">
                        <CardTitle className="text-nowrap text-ellipsis">{`${t("group")}: ${group.name}`}</CardTitle>
                        <CardAction className="overflow-x-auto max-w-full">
                            <ButtonGroup className="flex-nowrap">
                                <GroupDetailsLink
                                    groupId={group.id}
                                    variant="secondary"
                                />
                                {group.group_member.find(
                                    (member) =>
                                        member?.user_id ===
                                            claims?.claims?.sub &&
                                        (member?.role === "admin" ||
                                            member?.role === "editor"),
                                ) && (
                                    <>
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
                                        {claims?.claims?.role ===
                                            "authenticated" &&
                                            claims?.claims?.sub &&
                                            claims?.claims?.is_anonymous ===
                                                false &&
                                            claims.claims.sub ===
                                                group.owner_id && (
                                                <UpsertGroup
                                                    userId={claims.claims.sub}
                                                    variant="edit"
                                                    group={group}
                                                />
                                            )}
                                    </>
                                )}
                            </ButtonGroup>
                        </CardAction>
                    </CardHeader>
                    <CardContent className="@container z-10">
                        <div className="grid @max-sm:grid-cols-1 @max-md:grid-cols-2 @max-4xl:grid-cols-3 grid-cols-4 gap-4">
                            {group.trips.map((trip) => (
                                <TripCard key={trip.id} trip={trip} />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            ))}
            {claims?.claims?.role === "authenticated" &&
                claims?.claims?.sub &&
                claims?.claims?.is_anonymous === false && (
                    <UpsertGroup userId={claims.claims.sub} variant="create" />
                )}
        </>
    );
}
