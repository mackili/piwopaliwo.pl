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
import { useRouter } from "next/navigation";
import { Tables } from "@/database.types";
import { deleteTrips } from "./fetch";
import { useCurrentLocale, useI18n } from "@/locales/client";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export default function DeleteTrip({
    trip,
}: {
    trip: Tables<"v_trip_details">;
}) {
    const [saveError, setSaveError] = useState<PostgrestError | null>();
    const [isPending, setPending] = useState<boolean>(false);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const locale = useCurrentLocale();
    const router = useRouter();
    const t = useI18n();

    const handleDelete = async () => {
        if (!trip?.id) return;
        setPending(true);
        const { error } = await deleteTrips([trip.id]);
        setSaveError(error);
        if (!error) {
            router.push(`/${locale}/apps/trip-planner`);
            setDialogOpen(false);
        }
        setPending(false);
    };
    return (
        trip?.id && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="secondary"
                                type="button"
                                size="icon"
                            >
                                <Trash2Icon />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            {t("TripPlanner.delete.deleteTrip")}
                        </TooltipContent>
                    </Tooltip>
                </DialogTrigger>
                <DialogContent className="overflow-auto">
                    <DialogTitle>
                        {t("TripPlanner.delete.deleteTrip")}
                    </DialogTitle>
                    {t("TripPlanner.delete.deleteTripConfirmation", {
                        tripName: trip.name,
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
