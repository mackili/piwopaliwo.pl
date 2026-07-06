"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import FormInput from "@/components/ui/form-input";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { publicAccommodationUnitInsertSchema } from "@/database.schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditIcon, PlusIcon, SaveIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod";
import { upsertTripAccommodationUnit } from "../fetch";
import { TripAccommodationUnitSummary } from "../custom-schemas";
import { useState } from "react";
import { PostgrestError } from "@supabase/supabase-js";
import PostgrestErrorDisplay from "@/components/ui/postgrest-error-display";
import {
    AccommodationModificationChangeAction,
    AccommodationModificationSplitChangeEventType,
} from "../reducers";
import { useI18n } from "@/locales/client";

export enum UpsertAccommodationUnitVariant {
    CREATE = "CREATE",
    EDIT = "EDIT",
}

export default function UpsertAccommodationUnit({
    accommodationId,
    variant = UpsertAccommodationUnitVariant.CREATE,
    accommodationUnit,
    onSave,
}: {
    accommodationId: string;
    variant?: UpsertAccommodationUnitVariant;
    accommodationUnit?: TripAccommodationUnitSummary;
    onSave: (action: AccommodationModificationChangeAction) => void;
}) {
    const t = useI18n();
    const [saveError, setSaveError] = useState<PostgrestError | null>();
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const form = useForm<z.infer<typeof publicAccommodationUnitInsertSchema>>({
        resolver: zodResolver(publicAccommodationUnitInsertSchema),
        defaultValues: {
            accommodation_id:
                accommodationUnit?.accommodation_id || accommodationId,
            name: accommodationUnit?.name || "",
            capacity: accommodationUnit?.capacity,
            id: accommodationUnit?.accommodation_id,
        },
    });

    const handleSubmit = async (
        formData: z.infer<typeof publicAccommodationUnitInsertSchema>,
    ) => {
        const { data, error } = await upsertTripAccommodationUnit(formData);
        setSaveError(error);
        if (data) {
            if (variant === UpsertAccommodationUnitVariant.CREATE) {
                onSave({
                    type: AccommodationModificationSplitChangeEventType.UNIT_ADDED,
                    payload: data,
                });
            }
            if (variant === UpsertAccommodationUnitVariant.EDIT) {
                onSave({
                    type: AccommodationModificationSplitChangeEventType.UNIT_MODIFIED,
                    payload: data,
                });
            }
            setDialogOpen(false);
        }
    };
    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                {variant === UpsertAccommodationUnitVariant.CREATE ? (
                    <Button
                        variant="outline"
                        type="button"
                        className="border-dashed hover:bg-muted min-h-32 h-full"
                    >
                        <PlusIcon />
                    </Button>
                ) : (
                    <Button
                        variant="outline"
                        type="button"
                        className="hover:bg-muted"
                        size="icon"
                    >
                        <EditIcon />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="overflow-auto">
                <DialogTitle>
                    {variant === UpsertAccommodationUnitVariant.CREATE
                        ? t("add")
                        : t("edit")}{" "}
                    {t("TripPlanner.accommodation.accommodationUnit")}
                </DialogTitle>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        id="edit-accommodation-unit-form"
                    >
                        <div className="space-y-4">
                            <FormInput
                                name="name"
                                label={t("TripPlanner.accommodation.name")}
                                form={form}
                            />
                            <FormInput
                                name="capacity"
                                label={t("TripPlanner.accommodation.capacity")}
                                form={form}
                                type="number"
                                step="0"
                            />
                        </div>
                    </form>
                    <PostgrestErrorDisplay error={saveError} />
                </Form>
                <DialogFooter>
                    <Button
                        type="submit"
                        form="edit-accommodation-unit-form"
                        disabled={form.formState.isSubmitting}
                    >
                        {form.formState.isSubmitting ? (
                            <LoadingSpinner />
                        ) : (
                            <>
                                <SaveIcon /> {t("Blog.save")}
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
