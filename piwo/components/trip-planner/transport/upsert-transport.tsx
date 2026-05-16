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
import { publicTripTravelInsertSchema } from "@/database.schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditIcon, PlusIcon, SaveIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod";
import { upsertTransport } from "../fetch";
import { useState } from "react";
import { PostgrestError } from "@supabase/supabase-js";
import PostgrestErrorDisplay from "@/components/ui/postgrest-error-display";
import { TransportChangeAction, TransportChangeEventType } from "../reducers";
import { Constants, TablesInsert } from "@/database.types";
import { useRouter } from "next/navigation";

export enum UpsertTransportVariant {
    CREATE = "CREATE",
    EDIT = "EDIT",
}

const TRANSPORT_STATUSES = Constants.public.Enums.transaction_status;
const TRANSPORT_MODES = Constants.public.Enums.transportation_type;

export default function UpsertTransport({
    tripId,
    variant = UpsertTransportVariant.CREATE,
    transport,
    onSave,
}: {
    tripId: string;
    variant?: UpsertTransportVariant;
    transport?: TablesInsert<"trip_travel">;
    onSave?: (action: TransportChangeAction) => void;
}) {
    const [saveError, setSaveError] = useState<PostgrestError | null>();
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const router = useRouter();
    const form = useForm<z.infer<typeof publicTripTravelInsertSchema>>({
        resolver: zodResolver(publicTripTravelInsertSchema),
        defaultValues: { ...transport, trip_id: tripId },
    });

    const handleSubmit = async (
        formData: z.infer<typeof publicTripTravelInsertSchema>,
    ) => {
        const { data, error } = await upsertTransport(formData);
        setSaveError(error);
        if (data) {
            if (onSave) {
                onSave({
                    type: TransportChangeEventType.TRANSPORT_DETAILS_CHANGED,
                    payload: data,
                });
            }
            if (variant === UpsertTransportVariant.CREATE) {
                router.refresh();
            }
            setDialogOpen(false);
        }
    };
    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                {variant === UpsertTransportVariant.CREATE ? (
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
                    {variant === UpsertTransportVariant.CREATE ? "Add" : "Edit"}{" "}
                    Transport
                </DialogTitle>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        id="edit-transport-form"
                    >
                        <div className="space-y-4">
                            <FormInput
                                name="origin"
                                label="Origin"
                                form={form}
                            />
                            <FormInput
                                name="destination"
                                label="Destination"
                                form={form}
                            />
                            <FormInput
                                name="mode_of_transport"
                                label="Mode of Transport"
                                form={form}
                                type="select"
                                options={TRANSPORT_MODES.map((status) => ({
                                    value: status,
                                }))}
                            />
                            <FormInput
                                name="estimated_departure"
                                label="Estimated Departure"
                                form={form}
                                type="date-time"
                            />
                            <FormInput
                                name="duration"
                                label="Duration (Minutes)"
                                form={form}
                                type="number"
                                step="0"
                            />
                            <FormInput
                                name="capacity"
                                label="Capacity"
                                form={form}
                                type="number"
                                step="0"
                            />
                            <FormInput
                                name="status"
                                label="Status"
                                form={form}
                                type="select"
                                options={TRANSPORT_STATUSES.map((status) => ({
                                    value: status,
                                }))}
                            />
                            <FormInput
                                name="description"
                                label="Description"
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
                        form="edit-transport-form"
                        disabled={form.formState.isSubmitting}
                    >
                        {form.formState.isSubmitting ? (
                            <LoadingSpinner />
                        ) : (
                            <>
                                <SaveIcon /> Save
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
