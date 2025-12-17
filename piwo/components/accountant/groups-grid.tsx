import GroupCard from "./group-tile";
import { Group } from "@/app/[locale]/(with-sidebar)/apps/accountant/types";
import { createClient } from "@/utils/supabase/server";
import GroupCardSkeleton from "./group-tile-skeleton";
import { Suspense } from "react";
import PostgrestErrorDisplay from "@/components/ui/postgrest-error-display";
import { PostgrestError } from "@supabase/supabase-js";
import GroupsInvitations from "./groups-invitations";
export default async function GroupsGrid() {
    const supabase = await createClient();
    const userId = (await supabase.auth.getUser()).data?.user?.id;
    const {
        data,
        error,
    }: { data: Group[] | null; error: PostgrestError | null } = await supabase
        .from("v_group_membership")
        .select(
            "id,name,description,thumbnail_url,owner_id,currencies,created_at"
        )
        .eq("user_id", userId)
        .filter("archived_at", "is", null)
        .order("name");
    return data ? (
        <div className="grid @md:grid-cols-2 @2xl:grid-cols-3 gap-4 w-full">
            {data.map((group, index) => (
                <Suspense key={index} fallback={<GroupCardSkeleton />}>
                    <GroupCard group={group} />
                </Suspense>
            ))}
            <GroupsInvitations className="@md:row-span-2 @md:row-start-1 @md:col-start-2 @2xl:col-start-3" />
        </div>
    ) : (
        <PostgrestErrorDisplay error={error} />
    );
}
