"use server";

import { createClient } from "@/utils/supabase/server";
import { SupabaseResponse } from "@/utils/supabase/types";
import { GroupDailyTransactionSummary, GroupMemberBalance } from "../../types";

export async function fetchGroupMemberBalances(
    groupId: string
): Promise<SupabaseResponse<GroupMemberBalance>> {
    const supabase = await createClient();
    return await supabase
        .from("v_group_member_net_balance")
        .select("member,iso,paid_amount,owed_amount,net_amount,status")
        .eq("group_id", groupId)
        .order("status");
}

export async function fetchDailyTransactionSummaries(
    groupId: string,
    limit?: number,
    dateFrom?: string,
    dateTo?: string
): Promise<SupabaseResponse<GroupDailyTransactionSummary>> {
    const supabase = await createClient();
    let query = supabase
        .from("v_group_daily_transaction_summary")
        .select()
        .eq("group_id", groupId)
        .order("date", { ascending: false });
    if (dateFrom) {
        query = query.gte("date", dateFrom);
    }
    if (dateTo) {
        query = query.lte("date", dateFrom);
    }
    query.limit(limit ? Math.min(30, limit) : 30);
    const result = await query;
    return result;
}
