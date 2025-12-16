"use server";

import { createClient } from "@/utils/supabase/server";
import { GroupMember } from "../../../app/[locale]/(with-sidebar)/apps/accountant/types";
import { PostgrestError } from "@supabase/supabase-js";
import { SupabaseResponse } from "@/utils/supabase/types";
import { UserInfo } from "@/components/scoretracker/types";

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

export async function getAvailableUsers() {
    const supabase = await createClient();
    return (await supabase
        .from("UserInfo")
        .select()) as SupabaseResponse<UserInfo>;
}
