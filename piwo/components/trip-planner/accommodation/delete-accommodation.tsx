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
import {
    AccommodationModificationChangeAction,
    AccommodationModificationSplitChangeEventType,
} from "../reducers";
import { Trash2Icon } from "lucide-react";
import { deleteAccommodation } from "../fetch";
import { TripAccommodationSummaryView } from "../custom-schemas";
import { useI18n } from "@/locales/client";

export default function DeleteAccommodation({
    accommodation,
    onSave,
}: {
    accommodation: TripAccommodationSummaryView;
    onSave: (action: AccommodationModificationChangeAction) => void;
}) {
    const t = useI18n();
    const [saveError, setSaveError] = useState<PostgrestError | null>();
    const [isPending, setPending] = useState<boolean>(false);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);

    const handleDelete = async () => {
        if (!accommodation?.id) return;
        setPending(true);
        const { error } = await deleteAccommodation(accommodation.id);
        setSaveError(error);
        if (!error) {
            onSave({
                type: AccommodationModificationSplitChangeEventType.ACCOMMODATION_DELETED,
                payload: accommodation.id,
            });
            setDialogOpen(false);
        }
        setPending(false);
    };
    return (
        accommodation?.id && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" type="button" size="icon">
                        <Trash2Icon />
                    </Button>
                </DialogTrigger>
                <DialogContent className="overflow-auto">
                    <DialogTitle>
                        {t("TripPlanner.delete.deleteAccommodation")}
                    </DialogTitle>
                    {t("TripPlanner.delete.deleteConfirmation", {
                        name: accommodation.name,
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
