"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { LinkIcon, SaveIcon, UnlinkIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { fetchUnlinkedTransactions, updateLinkedTransaction } from "../fetch";
import { PostgrestError, PostgrestSingleResponse } from "@supabase/supabase-js";
import PostgrestErrorDisplay from "@/components/ui/postgrest-error-display";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { Database } from "@/database.types";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export enum LINK_ACTION_TYPE {
    LINK = "LINK",
    UNLINK = "UNLINK",
}

export default function LinkTransaction({
    tripId,
    recordId,
    recordType,
    transactionId,
    onSuccess,
}: {
    tripId: string;
    recordId: string;
    recordType: keyof Database["public"]["Tables"];
    transactionId?: string | null;
    onSuccess?: (
        value: null | {
            id: string;
            description: string;
            total_amount: number | null;
            currency_iso_code: string;
            related_record_id: string | null;
        },
    ) => void;
}) {
    const [availableTransactions, setAvailableTransactions] = useState<
        PostgrestSingleResponse<
            {
                id: string;
                description: string;
                total_amount: number | null;
                currency_iso_code: string;
            }[]
        >
    >();
    const [error, setError] = useState<PostgrestError | null>();
    const [isPending, setPending] = useState<boolean>(false);
    const [isDialogOpen, setDialogOpen] = useState<boolean>(false);
    const newTransactionId = useRef<string>("");
    useEffect(() => {
        const fetchTransactions = async () => {
            const response = await fetchUnlinkedTransactions(tripId);
            setError(response.error);
            setAvailableTransactions(response);
        };
        if (!transactionId) fetchTransactions();
    }, [tripId, transactionId]);

    const handleAction = async () => {
        setPending(true);
        const action = transactionId
            ? LINK_ACTION_TYPE.UNLINK
            : LINK_ACTION_TYPE.LINK;
        switch (action) {
            case LINK_ACTION_TYPE.UNLINK:
                const { error: unlinkError } = await updateLinkedTransaction({
                    transactionId: null,
                    recordId: recordId,
                    recordType: recordType,
                });
                if (unlinkError) {
                    setError(unlinkError);
                } else {
                    if (onSuccess) onSuccess(null);
                    setDialogOpen(false);
                }
                break;
            case LINK_ACTION_TYPE.LINK:
                console.log(newTransactionId.current);
                if (!newTransactionId.current) break;
                const { error: linkError, data } =
                    await updateLinkedTransaction({
                        transactionId: newTransactionId.current,
                        recordId: recordId,
                        recordType: recordType,
                    });
                if (linkError) {
                    setError(linkError);
                } else {
                    if (onSuccess) onSuccess(data);
                    setDialogOpen(false);
                }
                break;
            default:
                break;
        }
        setPending(false);
    };
    return (
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                    {transactionId ? <UnlinkIcon /> : <LinkIcon />}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>
                    {transactionId ? "Unlink" : "Link"} Transaction
                </DialogTitle>
                <PostgrestErrorDisplay error={error} />

                {!transactionId && (
                    <>
                        <Label>Select Transaction</Label>
                        <Select
                            onValueChange={(value) =>
                                (newTransactionId.current = value)
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {availableTransactions?.data?.map(
                                    (transaction) => (
                                        <SelectItem
                                            key={transaction.id}
                                            value={transaction.id}
                                        >
                                            {transaction.description}
                                        </SelectItem>
                                    ),
                                )}
                            </SelectContent>
                        </Select>
                    </>
                )}
                <DialogFooter>
                    <Button disabled={isPending} onClick={handleAction}>
                        {isPending ? (
                            <LoadingSpinner />
                        ) : transactionId ? (
                            <>
                                <UnlinkIcon /> Confirm
                            </>
                        ) : (
                            <>
                                <SaveIcon /> Link Transaction
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
