import { Card, CardAction, CardHeader } from "@/components/ui/card";
import GroupsGrid from "./(components)/(groups)/groups-grid";
import NewGroupButton from "./(components)/(actions)/new-group";
import { createClient } from "@/utils/supabase/server";
import { Suspense } from "react";
import GroupsGridSkeleton from "./(components)/(groups)/groups-grid-skeleton";

export default async function Accountant() {
    const supabase = await createClient();
    const { user } = (await supabase.auth.getUser()).data;
    return (
        <>
            <section>
                <Card>
                    <CardHeader>
                        <CardAction>
                            {user && <NewGroupButton user={user} />}
                        </CardAction>
                        <h1>Accountant</h1>
                    </CardHeader>
                </Card>
            </section>
            <section>
                <Suspense fallback={<GroupsGridSkeleton />}>
                    <GroupsGrid />
                </Suspense>
            </section>
        </>
    );
}
