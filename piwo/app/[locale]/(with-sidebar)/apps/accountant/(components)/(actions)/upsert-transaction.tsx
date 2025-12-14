"use server";

import { createClient } from "@/utils/supabase/server";
import {
    Transaction,
    TransactionSchema,
    TransactionWithSplits,
} from "../../types";
import { PostgrestError } from "@supabase/supabase-js";

const UPSERT_TRANSACTION_WITH_SPLITS_FUNCTION_NAME =
    "acc_upsert_transaction_with_splits";

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

export async function upsertTransactionWithSplits(
    transactionWithSplits: TransactionWithSplits
) {
    const supabase = await createClient();
    const { data, error } = (await supabase.rpc(
        UPSERT_TRANSACTION_WITH_SPLITS_FUNCTION_NAME,
        {
            p_transaction: TransactionSchema.parse(transactionWithSplits),
            p_transaction_splits: transactionWithSplits.splits,
        }
    )) as {
        data: string | null;
        error: PostgrestError | null;
    };
    return { data, error };
}
