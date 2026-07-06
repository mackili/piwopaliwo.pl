"use client";

import { Constants, TablesInsert } from "@/database.types";
import { publicTripInsertSchema } from "@/database.schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../ui/card";
import { Form } from "../ui/form";
import { ComponentProps, useState } from "react";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Edit2Icon, PlusIcon, SaveIcon } from "lucide-react";
import FormInput from "../ui/form-input";
import LoadingSpinner from "../ui/loading-spinner";
import { upsertTrips } from "./fetch";
import { toast } from "sonner";
import PostgrestErrorDisplay from "../ui/postgrest-error-display";
import { useRouter } from "next/navigation";
import { useI18n } from "@/locales/client";

const tripStatuses = Constants.public.Enums.trip_status.map((status) => ({
    value: status,
}));
const tripTypes = Constants.public.Enums.trip_types.map((type) => ({
    value: type,
}));

export default function EditTripForm({
    trip,
    displayMode = "card",
    title,
    className,
    onClose,
    isEdit = true,
    ...props
}: {
    displayMode: "dialog" | "card";
    title: string;
    isEdit?: boolean;
    trip?: TablesInsert<"trip">;
    onClose?: () => void;
} & ComponentProps<"div">) {
    const router = useRouter();
    const t = useI18n();
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const form = useForm<z.infer<typeof publicTripInsertSchema>>({
        resolver: zodResolver(publicTripInsertSchema),
        defaultValues: {
            id: trip?.id || undefined,
            currency_iso_code: trip?.currency_iso_code || "PLN",
            end_date: trip?.end_date || "",
            group_id: trip?.group_id || undefined,
            name: trip?.name || "",
            description: trip?.description || "",
            status: trip?.status || "proposed",
            start_date: trip?.start_date || "",
            type: trip?.type || "other",
            location: trip?.location || undefined,
            slug: "",
        },
    });
    async function onSubmit(values: z.infer<typeof publicTripInsertSchema>) {
        const { error } = await upsertTrips([values]);
        if (error) {
            toast("Failed to save in database", {
                description: <PostgrestErrorDisplay error={error} />,
                position: "bottom-center",
            });
            return;
        }
        toast("Trip saved successfully", { position: "bottom-center" });
        if (onClose) {
            onClose();
        }
        form.reset();
        router.refresh();
        setDialogOpen(false);
    }
    const submitButton = (
        <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="transition-all ease-in-out"
            form="edit-trip-form"
        >
            {form.formState.isSubmitting ? (
                <LoadingSpinner />
            ) : (
                <>
                    <SaveIcon />
                    {t("Blog.save")}
                </>
            )}
        </Button>
    );
    const formContent = (
        <Form {...form}>
            <form id="edit-trip-form" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="space-y-4">
                    <FormInput
                        name="name"
                        label={t("TripPlanner.tripAttributes.name")}
                        form={form}
                    />
                    <FormInput
                        name="description"
                        label={t("TripPlanner.tripAttributes.description")}
                        form={form}
                    />
                    <FormInput
                        name="start_date"
                        label={t("TripPlanner.tripAttributes.startDate")}
                        type="date"
                        form={form}
                    />
                    <FormInput
                        name="end_date"
                        label={t("TripPlanner.tripAttributes.endDate")}
                        type="date"
                        form={form}
                    />
                    <FormInput
                        name="location"
                        label={t("TripPlanner.tripAttributes.mainLocation")}
                        form={form}
                    />
                    <FormInput
                        name="status"
                        label={t("TripPlanner.tripAttributes.tripStatus")}
                        type="select"
                        form={form}
                        options={tripStatuses}
                    />
                    <FormInput
                        name="type"
                        label={t("TripPlanner.tripAttributes.tripType")}
                        type="select"
                        form={form}
                        options={tripTypes}
                    />
                    {displayMode === "card" ? (
                        <CardFooter>{submitButton}</CardFooter>
                    ) : (
                        <DialogFooter>{submitButton}</DialogFooter>
                    )}
                </div>
            </form>
        </Form>
    );
    if (displayMode === "card") {
        return (
            <Card className={className} {...props}>
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent>{formContent}</CardContent>
            </Card>
        );
    }
    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="secondary">
                    {isEdit ? (
                        <>
                            <Edit2Icon />
                            {t("edit")}
                        </>
                    ) : (
                        <>
                            <PlusIcon /> {t("TripPlanner.newTrip")}
                        </>
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent className={className} {...props}>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                {formContent}
            </DialogContent>
        </Dialog>
    );
}
