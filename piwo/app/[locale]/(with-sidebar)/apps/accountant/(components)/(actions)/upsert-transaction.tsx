"use server";

import { createClient } from "@/utils/supabase/server";
import { Transaction } from "../../types";
import { PostgrestError } from "@supabase/supabase-js";

export async function upsertTransaction(transaction: Transaction) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("transaction")
        .upsert(transaction)
        .select();
    return { data, error } as {
        data: Transaction[] | null;
        error: PostgrestError | null;
    };
}
