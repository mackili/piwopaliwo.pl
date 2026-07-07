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
import { BanknoteXIcon, Trash2Icon } from "lucide-react";
import { deleteTransactionsTripLedgers, deleteTripTransaction } from "../fetch";
import { Tables } from "@/database.types";
import { TripFinanceDataAction, TripFinanceDataActionType } from "../reducers";
import { useI18n } from "@/locales/client";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export default function UnmarkedPayedTransaction({
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

    const handleUnmarkPaid = async () => {
        if (!transaction?.id) return;
        setPending(true);
        const { data, error } = await deleteTransactionsTripLedgers([
            transaction.id,
        ]);
        setSaveError(error);
        if (!error) {
            if (onSuccess)
                onSuccess({
                    type: TripFinanceDataActionType.UPDATE_PLANNED,
                    payload: data,
                });
            setDialogOpen(false);
        }
        setPending(false);
    };
    return (
        transaction?.id && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <Tooltip>
                    <DialogTrigger asChild>
                        <TooltipTrigger asChild>
                            <Button
                                variant="secondary"
                                type="button"
                                size="icon"
                            >
                                <BanknoteXIcon />
                            </Button>
                        </TooltipTrigger>
                    </DialogTrigger>
                    <TooltipContent>
                        {t("TripPlanner.unmarkPaid.unmarkPaid")}
                    </TooltipContent>
                </Tooltip>
                <DialogContent className="overflow-auto">
                    <DialogTitle>
                        {t("TripPlanner.unmarkPaid.unmarkPaid")}
                    </DialogTitle>
                    {t("TripPlanner.unmarkPaid.unmarkPaidConfirmation", {
                        name: transaction.description,
                    })}
                    <PostgrestErrorDisplay error={saveError} />
                    <DialogFooter>
                        <Button
                            type="button"
                            onClick={handleUnmarkPaid}
                            disabled={isPending}
                        >
                            {isPending ? (
                                <LoadingSpinner />
                            ) : (
                                <>
                                    <BanknoteXIcon />
                                    {t("TripPlanner.unmarkPaid.unmarkPaid")}
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        )
    );
}
