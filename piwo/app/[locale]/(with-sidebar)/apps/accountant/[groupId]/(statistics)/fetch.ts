"use server";

import { createClient } from "@/utils/supabase/server";
import { SupabaseResponse } from "@/utils/supabase/types";
import { GroupMemberBalance } from "../../types";

export async function fetchGroupMemberBalances(
    groupId: string
): Promise<SupabaseResponse<GroupMemberBalance>> {
    console.log("fetching balances");
    const supabase = await createClient();
    return await supabase
        .from("v_group_member_net_balance")
        .select("member,iso,paid_amount,owed_amount,net_amount,status")
        .eq("group_id", groupId)
        .order("status");
}
