import {
    Group,
    GroupBalance,
} from "../../../app/[locale]/(with-sidebar)/apps/accountant/types";
import { ComponentProps } from "react";
import { createClient } from "@/utils/supabase/server";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import GroupReceivablesCard from "./receivables-card";
import { SupabaseResponse } from "@/utils/supabase/types";

export default async function GroupReceivables({
    group,
    ...props
}: { group: Group } & ComponentProps<"div">) {
    const supabase = await createClient();
    const balancesPromise = supabase
        .from("group_balance")
        .select(
            "borrower_id,lender_id,group_id,currency_balance,borrower:group_balance_borrower_id_fkey(id,nickname,user:UserInfo(firstName,lastName,userId,avatarUrl)),lender:group_balance_lender_id_fkey(id,nickname,user:UserInfo(firstName,lastName,userId,avatarUrl))"
        )
        .eq("group_id", group.id);
    const currenciesPromise = supabase
        .from("group")
        .select("currencies")
        .eq("id", group.id)
        .limit(1)
        .single();
    const [balances, currencies] = (await Promise.all([
        balancesPromise,
        currenciesPromise,
    ])) as [SupabaseResponse<GroupBalance>, PostgrestSingleResponse<Group>];
    return (
        <GroupReceivablesCard
            group={group}
            groupMembers={group?.members || []}
            balancesResponse={balances}
            currenciesResponse={currencies || []}
            {...props}
        />
    );
}
