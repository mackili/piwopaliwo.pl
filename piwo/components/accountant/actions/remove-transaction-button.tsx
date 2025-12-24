"use client";

import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";
import { removeTransaction } from "./upsert-transaction";
import LoadingSpinner from "@/components/ui/loading-spinner";
import PostgrestErrorDisplay from "@/components/ui/postgrest-error-display";
import { PostgrestError } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

export default function RemoveTransactionButton({
    transactionId,
}: {
    transactionId: string;
}) {
    const router = useRouter();
    const [state, setState] = useState<
        null | "pending" | { error: PostgrestError } | undefined
    >(undefined);
    async function removeTransactionAction() {
        setState("pending");
        const result = await removeTransaction(transactionId);
        if (result?.error) {
            setState({ error: result.error });
        } else {
            router.refresh();
            setState(null);
        }
    }
    return (
        <>
            <Button
                size="icon"
                variant="ghost"
                type="button"
                onClick={removeTransactionAction}
            >
                {state === "pending" ? <LoadingSpinner /> : <Trash2Icon />}
            </Button>
            {state && state !== "pending" && state?.error && (
                <PostgrestErrorDisplay error={state.error} />
            )}
        </>
    );
}
