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
import { publicAccommodationInsertSchema } from "@/database.schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditIcon, PlusIcon, SaveIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod";
import { upsertAccommodation } from "../fetch";
import { useState } from "react";
import { PostgrestError } from "@supabase/supabase-js";
import PostgrestErrorDisplay from "@/components/ui/postgrest-error-display";
import {
    AccommodationModificationChangeAction,
    AccommodationModificationSplitChangeEventType,
} from "../reducers";
import { Constants } from "@/database.types";
import { TripAccommodationSummaryView } from "../custom-schemas";
import { useRouter } from "next/navigation";
import { useI18n } from "@/locales/client";

export enum UpsertAccommodationVariant {
    CREATE = "CREATE",
    EDIT = "EDIT",
}

const ACCOMMODATION_STATUSES = Constants.public.Enums.transaction_status;

export default function UpsertAccommodation({
    tripId,
    variant = UpsertAccommodationVariant.CREATE,
    accommodation,
    onSave,
}: {
    tripId: string;
    variant?: UpsertAccommodationVariant;
    accommodation?: TripAccommodationSummaryView;
    onSave?: (action: AccommodationModificationChangeAction) => void;
}) {
    const [saveError, setSaveError] = useState<PostgrestError | null>();
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const router = useRouter();
    const t = useI18n();
    const form = useForm<z.infer<typeof publicAccommodationInsertSchema>>({
        resolver: zodResolver(publicAccommodationInsertSchema),
        defaultValues: {
            trip_id: tripId,
            id: accommodation?.id || undefined,
            check_in_date: accommodation?.check_in_date || undefined,
            check_out_date: accommodation?.check_out_date || undefined,
            description: accommodation?.description || undefined,
            name: accommodation?.name || undefined,
            status: accommodation?.status || undefined,
        },
    });

    const handleSubmit = async (
        formData: z.infer<typeof publicAccommodationInsertSchema>,
    ) => {
        const { data, error } = await upsertAccommodation(formData);
        setSaveError(error);
        if (data) {
            if (onSave) {
                onSave({
                    type: AccommodationModificationSplitChangeEventType.ACCOMMODATION_DETAILS_CHANGED,
                    payload: data,
                });
            }
            if (variant === UpsertAccommodationVariant.CREATE) {
                router.refresh();
            }
            setDialogOpen(false);
        }
    };
    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                {variant === UpsertAccommodationVariant.CREATE ? (
                    <Button
                        variant="outline"
                        type="button"
                        className="border-dashed hover:bg-muted min-h-32 h-full w-full"
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
            <DialogContent className="overflow-y-auto overflow-x-hidden">
                <DialogTitle>
                    {variant === UpsertAccommodationVariant.CREATE
                        ? t("add")
                        : t("edit")}{" "}
                    {t("TripPlanner.tabs.stay")}
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
                                name="status"
                                label={t("TripPlanner.accommodation.status")}
                                form={form}
                                type="select"
                                options={ACCOMMODATION_STATUSES.map(
                                    (status) => ({
                                        value: status,
                                        label: t(
                                            `TripPlanner.transactions.status.${status}`,
                                        ),
                                    }),
                                )}
                            />
                            <FormInput
                                name="check_in_date"
                                label={t("TripPlanner.accommodation.checkIn")}
                                form={form}
                                type="date-time"
                            />
                            <FormInput
                                name="check_out_date"
                                label={t("TripPlanner.accommodation.checkOut")}
                                form={form}
                                type="date-time"
                            />
                            <FormInput
                                name="description"
                                label={t("description")}
                                form={form}
                                type="text"
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
