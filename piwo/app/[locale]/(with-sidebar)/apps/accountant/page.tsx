import { Card, CardAction, CardHeader } from "@/components/ui/card";
import GroupsGrid from "@/components/accountant/groups-grid";
import NewGroupButton from "@/components/accountant/actions/new-group";
import { createClient } from "@/utils/supabase/server";
import { Suspense } from "react";
import GroupsGridSkeleton from "@/components/accountant/groups-grid-skeleton";
import { getI18n } from "@/locales/server";

export default async function Accountant() {
    const t = await getI18n();
    const supabase = await createClient();
    const { data: user } = await supabase.auth.getClaims();
    return (
        <div className="p-4 flex flex-col gap-4">
            <section>
                <Card>
                    <CardHeader>
                        <CardAction>
                            {user && (
                                <NewGroupButton userId={user?.claims?.sub} />
                            )}
                        </CardAction>
                        <h1 className="max-sm:text-3xl!">
                            {t("NavMenu.accountant")}
                        </h1>
                    </CardHeader>
                </Card>
            </section>
            <section className="@container">
                <Suspense fallback={<GroupsGridSkeleton />}>
                    <GroupsGrid />
                </Suspense>
            </section>
        </div>
    );
}
