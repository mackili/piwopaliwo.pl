"use client";

import { Constants, Enums, Tables } from "@/database.types";
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
import { Form, FormItem, FormLabel } from "@/components/ui/form";
import LoadingSpinner from "@/components/ui/loading-spinner";
import FormInput from "@/components/ui/form-input";
import {
    TripTransactionSplit,
    TripTransactionSplitSchema,
} from "../custom-schemas";
import { ParticipantResponseJson, upsertTripTransaction } from "../fetch";
import { toast } from "sonner";
import PostgrestErrorDisplay from "@/components/ui/postgrest-error-display";
import { VariantProps } from "class-variance-authority";
import { GroupCurrency } from "@/app/[locale]/(with-sidebar)/apps/accountant/types";
import { useCurrentLocale, useI18n } from "@/locales/client";
import {
    countPotentialParticipants,
    getTripLength,
    transactionTotalCostReducer,
    TripFinanceDataAction,
    TripFinanceDataActionType,
} from "../reducers";

const formObject = publicTripTransactionInsertSchema.extend({
    transaction_split: z.array(TripTransactionSplitSchema),
});

const TRANSACTION_SPLIT_TYPES =
    Constants.public.Enums.acc_transaction_split_type;
const TRANSACTION_CALCULATION_METHODS =
    Constants.public.Enums.trip_transaction_calculation_type;
const TRANSACTION_STATUSES = Constants.public.Enums.transaction_status;
const TRANSACTION_CATEGORIES = Constants.public.Enums.trip_transaction_category;

function TripTransactionTotalAmount({
    trip,
    unitAmount,
    calculationType,
    currencyIsoCode,
    defaultCurrency,
}: {
    trip: Tables<"v_trip_details">;
    unitAmount?: number;
    calculationType?: Enums<"trip_transaction_calculation_type">;
    currencyIsoCode?: string | null;
    defaultCurrency: string;
}) {
    const locale = useCurrentLocale();
    const [totalAmount, setTotalAmount] = useState<number | null>();
    useEffect(() => {
        setTotalAmount(
            transactionTotalCostReducer({
                unitCost: unitAmount || 0,
                calculationMethod: calculationType || "group_total",
                participantCount: countPotentialParticipants({
                    participants:
                        (trip?.participants as
                            | ParticipantResponseJson[]
                            | null) || [],
                }),
                tripLength: getTripLength({
                    startdate: new Date(trip?.start_date || ""),
                    endDate: new Date(trip?.end_date || ""),
                }),
            }),
        );
    }, [
        trip?.participants,
        trip?.start_date,
        trip?.end_date,
        unitAmount,
        calculationType,
    ]);
    return (
        totalAmount &&
        Intl.NumberFormat(locale, {
            style: "currency",
            currency: currencyIsoCode || defaultCurrency,
        }).format(totalAmount)
    );
}

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
    onSuccess?: (action: TripFinanceDataAction) => void;
} & ComponentProps<"button"> &
    VariantProps<typeof buttonVariants>) {
    const t = useI18n();
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
            currency_iso_code:
                transaction?.currency_iso_code ||
                trip?.currency_iso_code ||
                "PLN",
            id: transaction?.id,
            status: transaction?.status || "idea",
            category: transaction?.category || "other",
            notes: transaction?.notes,
            calculation_type:
                transaction?.calculation_type ||
                TRANSACTION_CALCULATION_METHODS[0],
            total_amount: transaction?.total_amount || 0,
        },
    });

    async function handleSubmit(values: z.infer<typeof formObject>) {
        const { data, error } = await upsertTripTransaction(values);
        if (error) {
            toast(t("TripPlanner.transactions.edit.failedToSaveTransaction"), {
                description: <PostgrestErrorDisplay error={error} />,
                position: "bottom-center",
            });
            return;
        }
        toast(t("TripPlanner.transactions.edit.transactionSavedSuccessfully"), {
            position: "bottom-center",
        });
        if (onSuccess) {
            onSuccess({
                type: TripFinanceDataActionType.UPDATE_PLANNED,
                payload: [data],
            });
        }
        setDialogOpen(false);
    }

    return (
        trip?.id && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                    <Button variant="default" {...props}>
                        {buttonContent || (
                            <>
                                <PlusIcon />{" "}
                                {t("TripPlanner.transactions.edit.planCost")}
                            </>
                        )}
                    </Button>
                </DialogTrigger>
                <DialogContent className="overflow-auto">
                    <DialogTitle>
                        {t("TripPlanner.transactions.edit.planTripCost")}
                    </DialogTitle>
                    <Form {...form}>
                        <form
                            id="edit-participants-form"
                            onSubmit={form.handleSubmit(handleSubmit)}
                        >
                            <div className="space-y-4">
                                <FormInput
                                    name="description"
                                    label={t(
                                        "TripPlanner.transactions.edit.planDescription",
                                    )}
                                    form={form}
                                />
                                <div className="flex flex-row gap-2">
                                    <FormInput
                                        name="amount"
                                        form={form}
                                        type="number"
                                        label={t(
                                            "TripPlanner.transactions.edit.amount",
                                        )}
                                        step="0.01"
                                        placeholder="0.00"
                                        className="grow"
                                    />
                                    <FormInput
                                        name="currency_iso_code"
                                        form={form}
                                        type="select"
                                        label={t(
                                            "TripPlanner.transactions.edit.currency",
                                        )}
                                        defaultValue={
                                            availableCurrencies.find(
                                                (currency) => currency.primary,
                                            )?.iso
                                        }
                                        options={availableCurrencies.map(
                                            (currency) => ({
                                                value: currency.iso,
                                            }),
                                        )}
                                    />
                                </div>
                                <FormItem id="total_amount">
                                    <FormLabel>
                                        {t(
                                            "TripPlanner.transactions.edit.totalAmount",
                                        )}
                                    </FormLabel>
                                    <p>
                                        <TripTransactionTotalAmount
                                            trip={trip}
                                            unitAmount={form.watch("amount")}
                                            calculationType={form.watch(
                                                "calculation_type",
                                            )}
                                            currencyIsoCode={form.watch(
                                                "currency_iso_code",
                                            )}
                                            defaultCurrency={
                                                trip.currency_iso_code || "PLN"
                                            }
                                        />
                                    </p>
                                </FormItem>
                                <FormInput
                                    name="calculation_type"
                                    form={form}
                                    type="select"
                                    label={t(
                                        "TripPlanner.transactions.edit.calculationType",
                                    )}
                                    options={TRANSACTION_CALCULATION_METHODS.map(
                                        (type) => ({
                                            value: type,
                                            label: t(
                                                `TripPlanner.transactions.calculationType.${type}`,
                                            ),
                                        }),
                                    )}
                                />
                                <FormInput
                                    name="category"
                                    form={form}
                                    type="select"
                                    label={t(
                                        "TripPlanner.transactions.edit.category",
                                    )}
                                    options={TRANSACTION_CATEGORIES.map(
                                        (category) => ({
                                            value: category,
                                            label: t(
                                                `TripPlanner.transactions.categories.${category}`,
                                            ),
                                        }),
                                    )}
                                />
                                <FormInput
                                    name="status"
                                    form={form}
                                    type="select"
                                    label={t(
                                        "TripPlanner.transactions.edit.status",
                                    )}
                                    options={TRANSACTION_STATUSES.map(
                                        (status) => ({
                                            value: status,
                                            label: t(
                                                `TripPlanner.transactions.status.${status}`,
                                            ),
                                        }),
                                    )}
                                />
                                <FormInput
                                    name="notes"
                                    form={form}
                                    type="text"
                                    label={t(
                                        "TripPlanner.transactions.edit.notes",
                                    )}
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
                                    {t("Blog.save")}
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        )
    );
}
