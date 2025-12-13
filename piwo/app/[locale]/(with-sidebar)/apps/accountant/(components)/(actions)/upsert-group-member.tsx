"use server";

import { createClient } from "@/utils/supabase/server";
import { GroupMember } from "../../types";
import { PostgrestError } from "@supabase/supabase-js";

export async function upsertGroupMember(groupMember: GroupMember) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("group_member")
        .upsert(groupMember)
        .select();
    return { data, error } as {
        data: GroupMember[] | null;
        error: PostgrestError | null;
    };
}
