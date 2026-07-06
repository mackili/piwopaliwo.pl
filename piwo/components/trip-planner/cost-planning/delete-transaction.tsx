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
import { TripFinanceDataAction, TripFinanceDataActionType } from "../reducers";
import { useI18n } from "@/locales/client";

export default function DeleteTransaction({
    transaction,
    onSuccess,
}: {
    transaction: Tables<"trip_transaction">;
    onSuccess?: (action: TripFinanceDataAction) => void;
}) {
    const [saveError, setSaveError] = useState<PostgrestError | null>();
    const [isPending, setPending] = useState<boolean>(false);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const t = useI18n();

    const handleDelete = async () => {
        if (!transaction?.id) return;
        setPending(true);
        const { error } = await deleteTripTransaction(transaction.id);
        setSaveError(error);
        if (!error) {
            if (onSuccess)
                onSuccess({
                    type: TripFinanceDataActionType.DELETE_PLANNED,
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
                    <DialogTitle>
                        {t("TripPlanner.delete.deleteTransaction")}
                    </DialogTitle>
                    {t("TripPlanner.delete.deleteTransactionConfirmation", {
                        transactionDescription: transaction.description,
                    })}
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
                                    <Trash2Icon /> {t("delete")}
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        )
    );
}
