"use server";

import { createClient } from "@/utils/supabase/server";
import { Group, GroupCurrency } from "../../types";
import { PostgrestError } from "@supabase/supabase-js";

export async function upsertGroup(group: Group) {
    return await upsertGroupData(group);
}

export async function updateGroupCurrencies(
    groupId: string,
    currencies: GroupCurrency[]
) {
    const supabase = await createClient();
    return (await supabase
        .from("group")
        .update({ id: groupId, currencies: currencies })
        .eq("id", groupId)
        .select()
        .single()) as {
        data: Group | null;
        error: PostgrestError | null;
    };
}

export async function upsertGroupData(group: Group) {
    const supabase = await createClient();
    const { data, error } = await supabase.from("group").upsert(group).select();
    return { data, error } as {
        data: Group[] | null;
        error: PostgrestError | null;
    };
}
