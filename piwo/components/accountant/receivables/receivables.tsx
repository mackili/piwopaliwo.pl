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
        .from("v_group_balance")
        .select()
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
