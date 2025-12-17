"use client";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFieldArray, useForm } from "react-hook-form";
import {
    GroupMember,
    SplitTypes,
    SplitTypesValues,
    Transaction,
    TransactionShare,
    TransactionSplit,
    TransactionWithSplits,
    TransactionWithSplitsSchema,
} from "../../../app/[locale]/(with-sidebar)/apps/accountant/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import ErrorMessage from "@/components/ui/error-message";
import { ComponentProps, useActionState, useEffect, useState } from "react";
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
    CardAction,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { PlusIcon, XIcon } from "lucide-react";
import { Label } from "@/components/ui/label";

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

function leastCommonDevisor(numbers: number[]) {
    function decimalsToIntegers(arr: number[]) {
        const decimals = arr.map((n) => {
            const s = n.toString();
            return s.includes(".") ? s.split(".")[1].length : 0;
        });
        const maxDecimals = Math.max(...decimals);
        const factor = 10 ** maxDecimals;

        return {
            integers: arr.map((n) => Math.round(n * factor)),
            factor,
        };
    }
    const { integers } = decimalsToIntegers(numbers);
    function gcd(a: number, b: number) {
        while (b !== 0) {
            [a, b] = [b, a % b];
        }
        return Math.abs(a);
    }
    const divisor = integers.reduce(gcd);
    return integers.map((n) => n / divisor);
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
    const [shares, setShares] = useState<TransactionShare[] | null>(null);
    const [result, handleSubmit, isPending] = useActionState(
        handleTransactionSave,
        null
    );
    /**
     * Set shares if default data type is 'shares'
     */
    useEffect(() => {
        if (data.split_type === "shares") {
            const totalAmount = data.amount;
            const percentShares: number[] = data.splits.map(
                (split) => split.amount / totalAmount
            );
            const integerShares = leastCommonDevisor(percentShares);
            const integerTransactionShares: TransactionShare[] =
                integerShares.map((share, index) => ({
                    share: share,
                    groupMemberId: data.splits[index].borrower_id,
                }));
            console.log(integerShares);
            setShares(integerTransactionShares);
        }
    }, [data]);

    const form = useForm<TransactionWithSplits>({
        resolver: zodResolver(TransactionWithSplitsSchema),
        defaultValues: {
            ...data,
            description: data?.description || "",
            id: data.id.length <= 0 ? uuid() : data.id,
            paid_by: undefined,
            splits: data?.splits || [],
            split_type: data.split_type || "equal",
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

    function setEqualAmountPerMember() {
        const splits = form.getValues("splits");
        const memberCount = splits.length;
        const amountPerMember = form.getValues("amount") / memberCount;
        splits.forEach((split, index) =>
            form.setValue(`splits.${index}.amount`, amountPerMember)
        );
    }

    function setEqualShares() {
        const splits = form.getValues("splits");
        const equalShares: TransactionShare[] = splits.map((split) => ({
            groupMemberId: split.borrower_id,
            share: 1,
        }));
        setShares(equalShares);
    }

    function setGroupMemberShare(groupMemberId: string, share: number) {
        const currentShares: TransactionShare[] = [...(shares || [])];
        const memberShare = currentShares.find(
            (share) => share.groupMemberId === groupMemberId
        );
        if (memberShare) {
            memberShare.share = share;
        }
        setShares(currentShares);
        setAmountPerMemberByShare();
    }

    function setAmountPerMemberByShare() {
        const currentShares: TransactionShare[] = [...(shares || [])];
        const totalShares = currentShares.reduce(
            (acc, curr) => (acc += curr.share),
            0
        );
        splits.forEach((split, index) => {
            form.setValue(
                `splits.${index}.amount`,
                (form.getValues("amount") / totalShares) *
                    (currentShares.find(
                        (sh) => sh.groupMemberId === split.borrower_id
                    )?.share || 0)
            );
        });
    }

    function handleSplitTypeChange(value: SplitTypes) {
        switch (value) {
            case "equal":
                setEqualAmountPerMember();
                break;
            case "shares":
                setEqualShares();
                break;
            default:
                break;
        }
        form.setValue("split_type", value);
    }

    function findShareOfMember(groupMemberId: string) {
        return shares?.find((share) => share.groupMemberId === groupMemberId);
    }

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
    const splitType = form.watch("split_type");

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
                                    onChange={(e) => {
                                        form.setValue(
                                            "amount",
                                            Number(e.target.value)
                                        );
                                        if (splitType === "equal") {
                                            setEqualAmountPerMember();
                                        }
                                        if (splitType === "shares") {
                                            setAmountPerMemberByShare();
                                        }
                                    }}
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
                    <CardHeader>
                        Splits
                        <CardAction>
                            <FormField
                                name="split_type"
                                control={form.control}
                                render={({ field }) => (
                                    <Select
                                        name={field.name}
                                        onValueChange={handleSplitTypeChange}
                                        value={field.value as SplitTypes}
                                    >
                                        <SelectTrigger>
                                            <SelectValue>
                                                {field.value.toUpperCase()}
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {SplitTypesValues.map((type) => (
                                                <SelectItem
                                                    key={type}
                                                    value={type}
                                                >
                                                    {type.toUpperCase()}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </CardAction>
                    </CardHeader>
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
                                            <FormItem
                                                className={
                                                    splitType !== "shares"
                                                        ? "col-span-8"
                                                        : "col-span-7 w-full"
                                                }
                                            >
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
                                            <FormItem
                                                className={
                                                    splitType !== "shares"
                                                        ? "col-span-3"
                                                        : "col-span-2"
                                                }
                                            >
                                                <FormLabel>Amount</FormLabel>
                                                <Input
                                                    type={
                                                        splitType === "shares"
                                                            ? "text"
                                                            : "number"
                                                    }
                                                    {...controllerField}
                                                    disabled={
                                                        splitType === "equal" ||
                                                        splitType === "shares"
                                                    }
                                                    step="0.01"
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
                                    {splitType === "shares" &&
                                        findShareOfMember(
                                            split.borrower_id
                                        ) && (
                                            <div className="grid gap-2 col-span-2">
                                                <Label>Shares</Label>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    step="1"
                                                    value={
                                                        findShareOfMember(
                                                            split.borrower_id
                                                        )?.share
                                                    }
                                                    onChange={(e) =>
                                                        setGroupMemberShare(
                                                            split.borrower_id,
                                                            Number(
                                                                e.target.value
                                                            )
                                                        )
                                                    }
                                                />
                                            </div>
                                        )}
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className={
                                            splitType === "shares"
                                                ? "col-span-1"
                                                : ""
                                        }
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
