"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useState } from "react";
import { PostgrestError } from "@supabase/supabase-js";
import PostgrestErrorDisplay from "@/components/ui/postgrest-error-display";
import { Trash2Icon } from "lucide-react";
import { deleteTripTransaction } from "../fetch";
import { Tables } from "@/database.types";
import {
    TransactionFetchAction,
    TransactionFetchActionType,
} from "../reducers";

export default function DeleteTransaction({
    transaction,
    onSuccess,
}: {
    transaction: Tables<"trip_transaction">;
    onSuccess?: (action: TransactionFetchAction) => void;
}) {
    const [saveError, setSaveError] = useState<PostgrestError | null>();
    const [isPending, setPending] = useState<boolean>(false);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);

    const handleDelete = async () => {
        if (!transaction?.id) return;
        setPending(true);
        const { error } = await deleteTripTransaction(transaction.id);
        setSaveError(error);
        if (!error) {
            if (onSuccess)
                onSuccess({
                    type: TransactionFetchActionType.DELETE,
                    payload: [transaction.id],
                });
            setDialogOpen(false);
        }
        setPending(false);
    };
    return (
        transaction?.id && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                    <Button variant="secondary" type="button" size="icon">
                        <Trash2Icon />
                    </Button>
                </DialogTrigger>
                <DialogContent className="overflow-auto">
                    <DialogTitle>Delete Transaction</DialogTitle>
                    Are you sure you want to delete {transaction.description}?
                    <PostgrestErrorDisplay error={saveError} />
                    <DialogFooter>
                        <Button
                            type="button"
                            onClick={handleDelete}
                            disabled={isPending}
                        >
                            {isPending ? (
                                <LoadingSpinner />
                            ) : (
                                <>
                                    <Trash2Icon /> Delete
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        )
    );
}
