import GroupCard from "./group-tile";
import { Group } from "@/app/[locale]/(with-sidebar)/apps/accountant/types";
import { createClient } from "@/utils/supabase/server";
import GroupCardSkeleton from "./group-tile-skeleton";
import { Suspense } from "react";
import PostgrestErrorDisplay from "@/components/ui/postgrest-error-display";
import { PostgrestError } from "@supabase/supabase-js";
export default async function GroupsGrid() {
    const supabase = await createClient();
    const {
        data,
        error,
    }: { data: Group[] | null; error: PostgrestError | null } = await supabase
        .from("group")
        .select(
            "id,name,description,thumbnail_url,owner_id,currencies,created_at"
        )
        .filter("archived_at", "is", null);
    return data ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
            {data.map((group, index) => (
                <Suspense key={index} fallback={<GroupCardSkeleton />}>
                    <GroupCard group={group} />
                </Suspense>
            ))}
        </div>
    ) : (
        <PostgrestErrorDisplay error={error} />
    );
}
