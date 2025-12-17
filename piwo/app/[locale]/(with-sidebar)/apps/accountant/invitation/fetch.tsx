"use server";

import { createClient } from "@/utils/supabase/server";
import { GroupInvite, GroupInviteView } from "../types";
import { SupabaseResponse } from "@/utils/supabase/types";

export async function acceptInvitation(
    invitation: GroupInviteView,
    userId: string
) {
    const data: GroupInvite = {
        group_id: invitation.group_id,
        group_member_id: invitation.group_member_id,
        user_id: userId,
        created_at: invitation.created_at,
        accepted_at: new Date().toISOString(),
    };
    const response = await updateInvitation(data);
    return response;
}

export async function declineInvitation(
    invitation: GroupInviteView,
    userId: string
) {
    const data: GroupInvite = {
        group_id: invitation.group_id,
        group_member_id: invitation.group_member_id,
        user_id: userId,
        created_at: invitation.created_at,
        rejected_at: new Date().toISOString(),
    };
    const response = await updateInvitation(data);
    return response;
}

export async function updateInvitation(invitation: GroupInvite) {
    const supabase = await createClient();
    return (await supabase
        .from("group_invitation")
        .update(invitation)
        .eq("group_id", invitation.group_id)
        .eq("group_member_id", invitation.group_member_id)
        .select()) as SupabaseResponse<GroupInvite>;
}

export async function upsertInvitation(invitation: GroupInvite) {
    const supabase = await createClient();
    return (await supabase
        .from("group_invitation")
        .upsert(invitation)
        .select()) as SupabaseResponse<GroupInvite>;
}
