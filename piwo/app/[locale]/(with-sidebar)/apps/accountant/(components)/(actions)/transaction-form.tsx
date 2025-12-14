"use client";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFieldArray, useForm } from "react-hook-form";
import {
    GroupMember,
    Transaction,
    TransactionSplit,
    TransactionWithSplits,
    TransactionWithSplitsSchema,
} from "../../types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import ErrorMessage from "@/components/ui/error-message";
import { ComponentProps, useActionState } from "react";
import { twMerge } from "tailwind-merge";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useRouter } from "next/navigation";
import { v4 as uuid } from "uuid";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { CURRENCY_ISO } from "@/public/statics";
import UserSelect from "@/components/ui/user-dropdown";
import { upsertTransactionWithSplits } from "./upsert-transaction";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { PlusIcon, XIcon } from "lucide-react";

function generateSplit(
    transaction: Transaction,
    existingSplitCount: number,
    groupMemberId?: string
): TransactionSplit {
    return {
        transaction_id: transaction.id,
        // @ts-expect-error this is not set as it is a default data generator
        borrower_id: groupMemberId || undefined,
        group_id: transaction.group_id,
        // amount: transaction.amount / Math.max(1, existingSplitCount + 1) || 0,
        amount: 0,
    };
}

export default function TransactionForm({
    data,
    groupMembers,
    setDialogOpen,
    ...props
}: {
    data: TransactionWithSplits;
    groupMembers: GroupMember[];
    setDialogOpen: (open: boolean) => void;
} & ComponentProps<"form">) {
    const router = useRouter();
    const [result, handleSubmit, isPending] = useActionState(
        handleTransactionSave,
        null
    );
    const form = useForm<TransactionWithSplits>({
        resolver: zodResolver(TransactionWithSplitsSchema),
        defaultValues: {
            ...data,
            description: data?.description || "",
            id: data.id.length <= 0 ? uuid() : data.id,
            paid_by: undefined,
            splits: data?.splits || [],
        },
    });

    const {
        fields: splits,
        append,
        remove,
    } = useFieldArray({
        control: form.control,
        name: "splits",
        keyName: "lender_id",
        rules: { minLength: 0 },
    });

    async function handleTransactionSave() {
        const isValid = await form.trigger();
        if (isValid === false) {
            return;
        }
        const formValues = form.getValues();
        if (formValues?.paid_by) {
            delete formValues.paid_by;
        }
        const result = await upsertTransactionWithSplits(formValues);
        if (result.data) {
            router.refresh();
            setDialogOpen(false);
        } else {
            return `${result.error?.code}: ${result.error?.message}`;
        }
    }
    return (
        <Form {...form}>
            <form
                action={handleSubmit}
                className={twMerge("grid gap-4", props?.className)}
                {...props}
            >
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field, fieldState }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <Input
                                type="text"
                                {...field}
                                value={field.value || ""}
                            />
                            {fieldState.invalid && (
                                <ErrorMessage
                                    error={fieldState?.error?.message || ""}
                                />
                            )}
                        </FormItem>
                    )}
                />
                <div className="flex flex-row w-full gap-2">
                    <FormField
                        control={form.control}
                        name="amount"
                        render={({ field, fieldState }) => (
                            <FormItem className="grow">
                                <FormLabel>Amount</FormLabel>
                                <Input
                                    type="number"
                                    {...field}
                                    value={field.value || ""}
                                    onChange={(e) =>
                                        form.setValue(
                                            "amount",
                                            Number(e.target.value)
                                        )
                                    }
                                />
                                {fieldState.invalid && (
                                    <ErrorMessage
                                        error={fieldState?.error?.message || ""}
                                    />
                                )}
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="currency_iso_code"
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <FormLabel>Currency</FormLabel>
                                <Select
                                    name={field.name}
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <SelectTrigger
                                        // value={field.value}
                                        aria-invalid={fieldState.invalid}
                                    >
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent position="item-aligned">
                                        {CURRENCY_ISO.map((iso) => (
                                            <SelectItem key={iso} value={iso}>
                                                {iso}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {fieldState.invalid && (
                                    <ErrorMessage
                                        error={fieldState?.error?.message || ""}
                                    />
                                )}
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="paid_by_id"
                    render={({ field, fieldState }) => (
                        <FormItem>
                            <FormLabel>Paid By</FormLabel>
                            <UserSelect
                                name={field.name}
                                value={field.value}
                                onValueChange={field.onChange}
                                users={(groupMembers || []).map((member) => ({
                                    userId: member.id,
                                    firstName:
                                        member?.user?.firstName ||
                                        member.nickname,
                                    lastName: member?.user?.lastName,
                                    avatarUrl: member?.user?.avatarUrl,
                                }))}
                                className="w-full"
                                // defaultUser={defaultUser}
                            />
                            {fieldState.invalid && (
                                <ErrorMessage
                                    error={fieldState?.error?.message || ""}
                                />
                            )}
                        </FormItem>
                    )}
                />
                <Card>
                    <CardHeader>Splits</CardHeader>
                    <CardContent className="flex flex-col gap-2">
                        {splits.map((split, index) => (
                            <Card key={index}>
                                <CardContent className="grid grid-cols-12 gap-2 ">
                                    <FormField
                                        name={`splits.${index}.borrower_id`}
                                        control={form.control}
                                        render={({
                                            field: controllerField,
                                            fieldState,
                                        }) => (
                                            <FormItem className="col-span-8">
                                                <FormLabel>Borrower</FormLabel>
                                                <UserSelect
                                                    name={controllerField.name}
                                                    value={
                                                        controllerField.value
                                                    }
                                                    onValueChange={
                                                        controllerField.onChange
                                                    }
                                                    users={(
                                                        groupMembers || []
                                                    ).map((member) => ({
                                                        userId: member.id,
                                                        firstName:
                                                            member?.user
                                                                ?.firstName ||
                                                            member.nickname,
                                                        lastName:
                                                            member?.user
                                                                ?.lastName,
                                                        avatarUrl:
                                                            member?.user
                                                                ?.avatarUrl,
                                                    }))}
                                                    className="w-full"
                                                />
                                                {fieldState.invalid && (
                                                    <ErrorMessage
                                                        error={
                                                            fieldState?.error
                                                                ?.message || ""
                                                        }
                                                    />
                                                )}
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        name={`splits.${index}.amount`}
                                        control={form.control}
                                        render={({
                                            field: controllerField,
                                        }) => (
                                            <FormItem className="col-span-3">
                                                <FormLabel>Amount</FormLabel>
                                                <Input
                                                    type="number"
                                                    {...controllerField}
                                                    onChange={(e) =>
                                                        controllerField.onChange(
                                                            Number(
                                                                e.target.value
                                                            )
                                                        )
                                                    }
                                                />
                                            </FormItem>
                                        )}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => remove(index)}
                                    >
                                        <XIcon />
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </CardContent>
                    <CardFooter>
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            onClick={() =>
                                append(
                                    generateSplit(
                                        form.getValues(),
                                        splits.length
                                    )
                                )
                            }
                        >
                            <PlusIcon />
                            Add Split
                        </Button>
                    </CardFooter>
                </Card>

                {result && <ErrorMessage error={`${String(result)}`} />}
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
