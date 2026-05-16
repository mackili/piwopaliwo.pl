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
import { TripAccommodationUnitSummary } from "../custom-schemas";
import { useState } from "react";
import { PostgrestError } from "@supabase/supabase-js";
import PostgrestErrorDisplay from "@/components/ui/postgrest-error-display";
import {
    AccommodationModificationChangeAction,
    AccommodationModificationSplitChangeEventType,
} from "../reducers";
import { Trash2Icon } from "lucide-react";
import { deleteTripAccommodationUnit } from "../fetch";

export default function DeleteAccommodationUnit({
    accommodationUnit,
    onSave,
}: {
    accommodationUnit: TripAccommodationUnitSummary;
    onSave: (action: AccommodationModificationChangeAction) => void;
}) {
    const [saveError, setSaveError] = useState<PostgrestError | null>();
    const [isPending, setPending] = useState<boolean>(false);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);

    const handleDelete = async () => {
        setPending(true);
        const { error } = await deleteTripAccommodationUnit(
            accommodationUnit.id,
        );
        setSaveError(error);
        if (!error) {
            onSave({
                type: AccommodationModificationSplitChangeEventType.UNIT_REMOVED,
                payload: accommodationUnit.id,
            });
            setDialogOpen(false);
        }
        setPending(false);
    };
    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" type="button" size="icon">
                    <Trash2Icon />
                </Button>
            </DialogTrigger>
            <DialogContent className="overflow-auto">
                <DialogTitle>Delete Accommodation Unit</DialogTitle>
                Are you sure you want to delete {accommodationUnit.name}?
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
    );
}
