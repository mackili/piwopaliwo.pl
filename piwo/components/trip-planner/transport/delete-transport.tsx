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
import { deleteTransport } from "../fetch";
import { useRouter } from "next/navigation";
import { Tables } from "@/database.types";
import { useI18n } from "@/locales/client";

export default function DeleteTransport({
    transport,
}: {
    transport: Tables<"v_trip_travel_summary">;
}) {
    const [saveError, setSaveError] = useState<PostgrestError | null>();
    const [isPending, setPending] = useState<boolean>(false);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const router = useRouter();
    const t = useI18n();
    const handleDelete = async () => {
        if (!transport?.id) return;
        setPending(true);
        const { error } = await deleteTransport(transport.id);
        setSaveError(error);
        if (!error) {
            router.refresh();
            setDialogOpen(false);
        }
        setPending(false);
    };
    return (
        transport?.id && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" type="button" size="icon">
                        <Trash2Icon />
                    </Button>
                </DialogTrigger>
                <DialogContent className="overflow-auto">
                    <DialogTitle>
                        {t("TripPlanner.delete.deleteGeneric", {
                            name: t("TripPlanner.tabs.transport"),
                        })}
                    </DialogTitle>
                    {t("TripPlanner.delete.deleteConfirmation", {
                        name: transport.name,
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
