"use client";

import { Constants, Tables } from "@/database.types";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { ComponentProps, ReactElement, useEffect, useState } from "react";
import { PlusIcon, SaveIcon } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useForm } from "react-hook-form";
import z from "zod";
import { publicTripTransactionInsertSchema } from "@/database.schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../ui/form";
import LoadingSpinner from "../ui/loading-spinner";
import { useRouter } from "next/navigation";
import FormInput from "../ui/form-input";
import {
    TripTransactionSplit,
    TripTransactionSplitSchema,
} from "./custom-schemas";
import { ParticipantResponseJson, upsertTripTransaction } from "./fetch";
import { toast } from "sonner";
import PostgrestErrorDisplay from "../ui/postgrest-error-display";
import { VariantProps } from "class-variance-authority";
import { GroupCurrency } from "@/app/[locale]/(with-sidebar)/apps/accountant/types";
import { DataTable } from "../ui/datatable";
import { ColumnDef } from "@tanstack/react-table";

const formObject = publicTripTransactionInsertSchema.extend({
    transaction_split: z.array(TripTransactionSplitSchema),
});

const TRANSACTION_SPLIT_TYPES =
    Constants.public.Enums.acc_transaction_split_type;
const TRANSACTION_CALCULATION_METHODS =
    Constants.public.Enums.trip_transaction_calculation_type;
const TRANSACTION_STATUSES = Constants.public.Enums.transaction_status;
const TRANSACTION_CATEGORIES = Constants.public.Enums.trip_transaction_category;

export default function TripTransactionEdit({
    trip,
    transaction,
    buttonContent,
    onSuccess,
    ...props
}: {
    trip: Tables<"v_trip_details">;
    transaction?: Tables<"trip_transaction">;
    buttonContent?: ReactElement;
    onSuccess?: (transaction: Tables<"trip_transaction">) => void;
} & ComponentProps<"button"> &
    VariantProps<typeof buttonVariants>) {
    const router = useRouter();
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [availableCurrencies, setAvailableCurrencies] = useState<
        GroupCurrency[]
    >([]);
    const supabase = createClient();
    useEffect(() => {
        const fetchCurrencies = async () => {
            if (!trip?.group_id) return;
            const { data } = await supabase
                .from("group")
                .select("currencies")
                .eq("id", trip.group_id)
                .limit(1)
                .single()
                .overrideTypes<{ currencies: GroupCurrency[] }>();
            setAvailableCurrencies(data?.currencies || []);
        };
        fetchCurrencies();
    }, [trip.group_id, supabase]);
    const form = useForm<z.infer<typeof formObject>>({
        resolver: zodResolver(formObject),
        defaultValues: {
            trip_id: transaction?.trip_id || trip?.id || "",
            group_id: transaction?.group_id || trip?.group_id || "",
            description: transaction?.description,
            split_type: transaction?.split_type || TRANSACTION_SPLIT_TYPES[0],
            transaction_split:
                (transaction?.transaction_split as TripTransactionSplit[]) ||
                [],
            amount: transaction?.amount,
            currency_iso_code: transaction?.currency_iso_code,
            id: transaction?.id,
            status: transaction?.status,
            category: transaction?.category,
            notes: transaction?.notes,
            calculation_type:
                transaction?.calculation_type ||
                TRANSACTION_CALCULATION_METHODS[0],
        },
    });

    async function handleSubmit(values: z.infer<typeof formObject>) {
        const { data, error } = await upsertTripTransaction(values);
        if (error) {
            toast("Failed to save to transaction", {
                description: <PostgrestErrorDisplay error={error} />,
                position: "bottom-center",
            });
            return;
        }
        toast("Transaction saved successfully", {
            position: "bottom-center",
        });
        form.reset();
        router.refresh();
        if (onSuccess) {
            onSuccess(data);
        }
        setDialogOpen(false);
    }
    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="default" {...props}>
                    {buttonContent || (
                        <>
                            <PlusIcon /> Plan cost
                        </>
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Plan Trip Cost</DialogTitle>
                <Form {...form}>
                    <form
                        id="edit-participants-form"
                        onSubmit={form.handleSubmit(handleSubmit)}
                    >
                        <div className="space-y-4">
                            <FormInput name="description" form={form} />
                            <div className="flex flex-row gap-2">
                                <FormInput
                                    name="amount"
                                    form={form}
                                    type="number"
                                    label="Amount"
                                    step="0.01"
                                    placeholder="0.00"
                                    className="grow"
                                />
                                <FormInput
                                    name="currency_iso_code"
                                    form={form}
                                    type="select"
                                    label="Currency"
                                    options={availableCurrencies.map(
                                        (currency) => ({
                                            value: currency.iso,
                                        }),
                                    )}
                                />
                            </div>
                            {/* <FormInput
                                name="split_type"
                                form={form}
                                type="select"
                                label="Split Type"
                                options={TRANSACTION_SPLIT_TYPES.map(
                                    (split) => ({
                                        value: split,
                                    }),
                                )}
                            /> */}
                            <FormInput
                                name="category"
                                form={form}
                                type="select"
                                label="Category"
                                options={TRANSACTION_CATEGORIES.map(
                                    (category) => ({
                                        value: category,
                                    }),
                                )}
                            />
                            <FormInput
                                name="status"
                                form={form}
                                type="select"
                                label="Status"
                                options={TRANSACTION_STATUSES.map((status) => ({
                                    value: status,
                                }))}
                            />
                            <FormInput
                                name="notes"
                                form={form}
                                type="text"
                                label="Notes"
                            />
                        </div>
                    </form>
                </Form>
                <DialogFooter>
                    <Button
                        variant="default"
                        type="submit"
                        form="edit-participants-form"
                        disabled={form.formState.isSubmitting}
                    >
                        {form.formState.isSubmitting ? (
                            <LoadingSpinner />
                        ) : (
                            <>
                                <SaveIcon />
                                Save
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
