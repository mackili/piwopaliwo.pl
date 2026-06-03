"use server";

import { createClient } from "@/utils/supabase/server";
import { TablesInsert } from "@/database.types";

export async function upsertGroupMember(
    groupMember: TablesInsert<"group_member">,
) {
    const supabase = await createClient();
    return await supabase.from("group_member").upsert(groupMember).select();
}

export async function getAvailableUsers() {
    const supabase = await createClient();
    return await supabase.from("UserInfo").select();
}
