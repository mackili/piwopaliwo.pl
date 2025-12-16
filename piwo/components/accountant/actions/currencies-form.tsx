"use client";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFieldArray, useForm } from "react-hook-form";
import {
    Group,
    GroupCurrency,
    GroupCurrencySchema,
} from "../../../app/[locale]/(with-sidebar)/apps/accountant/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import ErrorMessage from "@/components/ui/error-message";
import { ComponentProps, useActionState } from "react";
import { twMerge } from "tailwind-merge";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useRouter } from "next/navigation";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { CURRENCY_ISO } from "@/public/statics";
import * as z from "zod";
import { updateGroupCurrencies } from "./upsert-group";
import { XIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import PostgrestErrorDisplay from "@/components/ui/postgrest-error-display";

const CurrencyArrayObjectSchema = z.object({
    currencies: z.array(GroupCurrencySchema),
});

export default function GroupCurrenciesForm({
    data,
    setDialogOpen,
    ...props
}: {
    data: Group;
    setDialogOpen: (open: boolean) => void;
} & ComponentProps<"form">) {
    const router = useRouter();
    const [result, handleSubmit, isPending] = useActionState(
        handleTransactionSave,
        null
    );
    const form = useForm<z.infer<typeof CurrencyArrayObjectSchema>>({
        resolver: zodResolver(CurrencyArrayObjectSchema),
        defaultValues: {
            currencies: data?.currencies ? [...data.currencies] : [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "currencies",
        keyName: "iso",
        rules: { minLength: 1 },
    });

    async function handleTransactionSave() {
        const isValid = await form.trigger();
        if (isValid === false) {
            return;
        }
        const result = await updateGroupCurrencies(
            data.id,
            form.getValues().currencies
        );
        if (result.data) {
            router.refresh();
            setDialogOpen(false);
        } else {
            return result.error;
        }
    }

    function handlePrimaryCheckedChange(currency: GroupCurrency) {
        const allCurrencies = form.getValues().currencies;
        const updatedCurrencyIndex = allCurrencies.findIndex(
            (element) => element.iso === currency.iso
        );
        const oldPrimaryCurrencyIndex = allCurrencies.findIndex(
            (element) => element.primary
        );
        if (
            !currency.primary &&
            oldPrimaryCurrencyIndex === updatedCurrencyIndex
        ) {
            form.setError("root", {
                message: "There must be at least one primary currency",
            });
        } else if (
            oldPrimaryCurrencyIndex !== updatedCurrencyIndex &&
            currency.primary
        ) {
            form.clearErrors("root");
            form.setValue(
                `currencies.${oldPrimaryCurrencyIndex}.primary`,
                false
            );
            form.setValue(
                `currencies.${updatedCurrencyIndex}.primary`,
                currency.primary
            );
        }
    }

    function availableCurrencies(currentCurrency: string) {
        const usedCurrencies = form
            .getValues()
            .currencies.map((currency) => currency.iso);
        return CURRENCY_ISO.filter(
            (iso) => iso === currentCurrency || !usedCurrencies.includes(iso)
        );
    }
    form.watch("currencies");
    return (
        <Form {...form}>
            <form
                action={handleSubmit}
                className={twMerge("grid gap-4", props?.className)}
                {...props}
            >
                {fields.map((currency, index) => (
                    <Card key={currency.iso}>
                        <CardContent className="flex flex-row gap-2">
                            <FormField
                                name={`currencies.${index}.iso`}
                                control={form.control}
                                render={({ field: controllerField }) => (
                                    <FormItem>
                                        <FormLabel>Currency Code</FormLabel>
                                        <Select
                                            {...controllerField}
                                            onValueChange={
                                                controllerField.onChange
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableCurrencies(
                                                    controllerField.value
                                                ).map((isoCode) => (
                                                    <SelectItem
                                                        key={isoCode}
                                                        value={isoCode}
                                                    >
                                                        {isoCode}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name={`currencies.${index}.rate`}
                                control={form.control}
                                render={({ field: controllerField }) => (
                                    <FormItem>
                                        <FormLabel>Currency Rate</FormLabel>
                                        <Input
                                            type="number"
                                            {...controllerField}
                                            onChange={(e) =>
                                                controllerField.onChange(
                                                    Number(e.target.value)
                                                )
                                            }
                                        />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name={`currencies.${index}.primary`}
                                control={form.control}
                                render={({
                                    field: controllerField,
                                    fieldState,
                                }) => (
                                    <FormItem>
                                        <FormLabel>Primary</FormLabel>
                                        <Checkbox
                                            name={controllerField.name}
                                            disabled={controllerField.disabled}
                                            aria-invalid={fieldState.invalid}
                                            checked={controllerField.value}
                                            onCheckedChange={(checked) => {
                                                const currency =
                                                    form.getValues().currencies[
                                                        index
                                                    ];
                                                handlePrimaryCheckedChange({
                                                    ...currency,
                                                    primary: Boolean(checked),
                                                });
                                            }}
                                        />
                                    </FormItem>
                                )}
                            />
                            <Button
                                variant="ghost"
                                size="icon"
                                type="button"
                                onClick={() => remove(index)}
                            >
                                <XIcon />
                            </Button>
                        </CardContent>
                    </Card>
                ))}
                <Button
                    type="button"
                    variant="secondary"
                    onClick={() =>
                        append({
                            iso: "",
                            rate: 0,
                            primary: false,
                        })
                    }
                >
                    Add Currency
                </Button>
                {form.formState.errors.root && (
                    <ErrorMessage
                        error={form.formState.errors.root.message || ""}
                    />
                )}
                <PostgrestErrorDisplay error={result} />
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button disabled={isPending} type="submit">
                        {isPending ? <LoadingSpinner /> : "Submit"}
                    </Button>
                </DialogFooter>
            </form>
        </Form>
    );
}
