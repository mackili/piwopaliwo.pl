import { createClient } from "@/utils/supabase/server";
import { Group } from "../types";
import { PostgrestError } from "@supabase/supabase-js";
import { GroupHead } from "./head";
import GroupMembersTable from "./members-table";
import TotalSpent from "./total-spent";
import GroupCurrenciesTable from "./currencies-table";
import GroupTransactionTable from "./transactions-table";
import PostgrestErrorDisplay from "@/components/ui/postgrest-error-display";
import GroupReceivables from "./(receivables)/receivables";
import GroupStatistics from "./stats";

export default async function Page({
    params,
}: {
    params: Promise<{ groupId: string }>;
}) {
    const { groupId } = await params;
    const supabase = await createClient();
    const { data, error } = (await supabase
        .from("group")
        .select(
            "id,name,description,thumbnail_url,owner_id,created_at,members:group_member_group_id_fkey(id,nickname,added_at,user_id,user:UserInfo(firstName,lastName,avatarUrl)),currencies"
        )
        .eq("id", groupId)
        .single()) as { data: Group | null; error: PostgrestError | null };
    const { user } = (await supabase.auth.getUser()).data;
    return data && user ? (
        <div className="@container">
            <div className="w-full grid @max-xl:grid-cols-1 @2xl:grid-cols-2 @4xl:grid-cols-6 p-4 gap-4">
                <GroupHead group={data} user={user} className="col-span-full" />
                <GroupMembersTable group={data} className="@4xl:col-span-2" />
                <GroupCurrenciesTable
                    group={data}
                    className="@4xl:col-span-2"
                />
                <TotalSpent group={data} className="@4xl:col-span-2" />
                <GroupReceivables group={data} className="@4xl:col-span-3" />
                <GroupTransactionTable
                    group={data}
                    className="@max-4xl:col-span-full @4xl:col-span-3"
                />
                <GroupStatistics group={data} className="col-span-full" />
            </div>
        </div>
    ) : (
        <PostgrestErrorDisplay error={error} />
    );
}
