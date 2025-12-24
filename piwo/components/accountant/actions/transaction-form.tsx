"use client";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFieldArray, useForm } from "react-hook-form";
import {
    GroupMember,
    SplitTypes,
    SplitTypesValues,
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
import { useI18n } from "@/locales/client";

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
    const t = useI18n();
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
        if (memberCount <= 0) return;
        const amountPerMember = form.getValues("amount") / memberCount;
        splits.forEach((_, index) =>
            form.setValue(`splits.${index}.amount`, amountPerMember)
        );
    }

    function syncSharesWithSplits(
        nextSplits: TransactionSplit[],
        prevShares: TransactionShare[] = []
    ): TransactionShare[] {
        const seen = new Set<string>();
        const nextShares: TransactionShare[] = [];

        for (const split of nextSplits) {
            const borrowerId = split.borrower_id;
            if (!borrowerId) continue;
            if (seen.has(borrowerId)) continue;
            seen.add(borrowerId);

            const prev = prevShares.find((s) => s.groupMemberId === borrowerId);
            nextShares.push({
                groupMemberId: borrowerId,
                share: prev?.share ?? 1,
            });
        }

        return nextShares;
    }

    function setEqualShares() {
        const splits = form.getValues("splits");
        const equalShares: TransactionShare[] = splits
            .map((split) => split.borrower_id)
            .filter((id): id is string => Boolean(id))
            .map((id) => ({ groupMemberId: id, share: 1 }));
        setShares(equalShares);
        setAmountPerMemberByShare(equalShares);
    }

    function setGroupMemberShare(groupMemberId: string, share: number) {
        const nextShares: TransactionShare[] = [...(shares || [])];
        const memberShare = nextShares.find(
            (s) => s.groupMemberId === groupMemberId
        );
        if (memberShare) {
            memberShare.share = share;
        } else {
            nextShares.push({ groupMemberId, share });
        }
        setShares(nextShares);
        setAmountPerMemberByShare(nextShares);
    }

    function handleBorrowerChange(index: number, nextBorrowerId: string) {
        const splitType = form.getValues("split_type");

        if (splitType === "equal") {
            setEqualAmountPerMember();
            return;
        }

        if (splitType !== "shares") {
            return;
        }

        const currentSplits = form.getValues("splits");
        const prevBorrowerId = currentSplits[index]?.borrower_id;

        const nextSplits = [...currentSplits];
        nextSplits[index] = {
            ...nextSplits[index],
            borrower_id: nextBorrowerId,
        };

        const prevShares = shares ?? [];
        const nextShares = syncSharesWithSplits(nextSplits, prevShares);

        // Try to carry over the edited row's previous share value to the new borrower,
        // but only if the new borrower didn't already exist in shares.
        const newBorrowerAlreadyHadShare = prevShares.some(
            (s) => s.groupMemberId === nextBorrowerId
        );
        if (!newBorrowerAlreadyHadShare && prevBorrowerId) {
            const prevShareValue =
                prevShares.find((s) => s.groupMemberId === prevBorrowerId)
                    ?.share ?? 1;
            const entry = nextShares.find(
                (s) => s.groupMemberId === nextBorrowerId
            );
            if (entry) entry.share = prevShareValue;
        }

        setShares(nextShares);
        setAmountPerMemberByShare(nextShares);
    }

    function setAmountPerMemberByShare(sharesOverride?: TransactionShare[]) {
        const currentShares: TransactionShare[] = [
            ...(sharesOverride ?? shares ?? []),
        ];
        const totalShares = currentShares.reduce(
            (acc, curr) => acc + curr.share,
            0
        );

        const currentSplits = form.getValues("splits");

        if (totalShares <= 0) {
            // if nobody has shares yet, set 0 (or return)
            currentSplits.forEach((_, index) =>
                form.setValue(`splits.${index}.amount`, 0)
            );
            return;
        }

        const amount = form.getValues("amount");

        currentSplits.forEach((split, index) => {
            const memberShare =
                currentShares.find(
                    (sh) => sh.groupMemberId === split.borrower_id
                )?.share ?? 0;

            form.setValue(
                `splits.${index}.amount`,
                (amount / totalShares) * memberShare
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

    function handleAddSplit() {
        const transaction = form.getValues();
        const defaultSplit: TransactionSplit = {
            transaction_id: transaction.id,
            // @ts-expect-error this is not set as it is a default data generator
            borrower_id: undefined,
            group_id: transaction.group_id,
            amount: 0,
        };
        append(defaultSplit);
        switch (transaction.split_type) {
            case "equal":
                setEqualAmountPerMember();
                break;
            case "shares":
                setEqualShares();
                break;
            default:
                break;
        }
    }

    function handleRemoveSplit(index: number) {
        const splitType = form.getValues("split_type");
        const currentSplits = form.getValues("splits");
        const nextSplits = currentSplits.filter((_, i) => i !== index);

        if (splitType === "equal") {
            remove(index);
            // recompute from nextSplits without depending on RHF update timing
            if (nextSplits.length <= 0) return;
            const amountPerMember =
                form.getValues("amount") / nextSplits.length;
            nextSplits.forEach((_, i) =>
                form.setValue(`splits.${i}.amount`, amountPerMember)
            );
            return;
        }

        if (splitType === "shares") {
            const prevShares = shares ?? [];
            const nextShares = syncSharesWithSplits(nextSplits, prevShares);
            setShares(nextShares);
            setAmountPerMemberByShare(nextShares);
        }

        remove(index);
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
    const watchedSplits = form.watch("splits");

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
                            <FormLabel>{t("Accountant.description")}</FormLabel>
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
                                <FormLabel>{t("Accountant.amount")}</FormLabel>
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
                                <FormLabel>
                                    {t("Accountant.currency")}
                                </FormLabel>
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
                            <FormLabel>{t("Accountant.paidBy")}</FormLabel>
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
                        {t("Accountant.splits")}
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
                        {splits.map((split, index) => {
                            const borrowerId = form.watch(
                                `splits.${index}.borrower_id`
                            );

                            const takenBorrowerIds = new Set(
                                (watchedSplits || [])
                                    .map((s) => s.borrower_id)
                                    .filter(
                                        (id): id is string =>
                                            Boolean(id) && id !== borrowerId
                                    )
                            );

                            return (
                                <Card key={index}>
                                    <CardContent className="grid @max-md:grid-cols-6 @md:grid-cols-12 gap-2 items-end">
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
                                                            : "col-span-6 w-full"
                                                    }
                                                >
                                                    <FormLabel>
                                                        {t(
                                                            "Accountant.borrower"
                                                        )}
                                                    </FormLabel>
                                                    <UserSelect
                                                        name={
                                                            controllerField.name
                                                        }
                                                        value={
                                                            controllerField.value
                                                        }
                                                        onValueChange={(
                                                            newId
                                                        ) => {
                                                            if (
                                                                takenBorrowerIds.has(
                                                                    newId
                                                                )
                                                            ) {
                                                                form.setError(
                                                                    `splits.${index}.borrower_id`,
                                                                    {
                                                                        type: "validate",
                                                                        message:
                                                                            "Borrower already selected",
                                                                    }
                                                                );
                                                                return;
                                                            }

                                                            form.clearErrors(
                                                                `splits.${index}.borrower_id`
                                                            );
                                                            controllerField.onChange(
                                                                newId
                                                            );
                                                            handleBorrowerChange(
                                                                index,
                                                                newId
                                                            );
                                                        }}
                                                        users={(
                                                            groupMembers || []
                                                        )
                                                            .filter(
                                                                (member) =>
                                                                    !takenBorrowerIds.has(
                                                                        member.id
                                                                    )
                                                            )
                                                            .map((member) => ({
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
                                                                fieldState
                                                                    ?.error
                                                                    ?.message ||
                                                                ""
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
                                                            ? "col-span-4"
                                                            : "col-span-2"
                                                    }
                                                >
                                                    <FormLabel>
                                                        {t("Accountant.amount")}
                                                    </FormLabel>
                                                    <Input
                                                        type={
                                                            splitType ===
                                                            "shares"
                                                                ? "text"
                                                                : "number"
                                                        }
                                                        {...controllerField}
                                                        disabled={
                                                            splitType ===
                                                                "equal" ||
                                                            splitType ===
                                                                "shares"
                                                        }
                                                        step="0.01"
                                                        onChange={(e) =>
                                                            controllerField.onChange(
                                                                Number(
                                                                    e.target
                                                                        .value
                                                                )
                                                            )
                                                        }
                                                    />
                                                </FormItem>
                                            )}
                                        />
                                        {splitType === "shares" && (
                                            <div className="grid gap-2 col-span-2">
                                                <Label>Shares</Label>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    step="1"
                                                    value={
                                                        findShareOfMember(
                                                            borrowerId || ""
                                                        )?.share ?? 0
                                                    }
                                                    onChange={(e) => {
                                                        if (!borrowerId) return;
                                                        setGroupMemberShare(
                                                            borrowerId,
                                                            Number(
                                                                e.target.value
                                                            )
                                                        );
                                                    }}
                                                />
                                            </div>
                                        )}
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            className={`${
                                                splitType === "shares"
                                                    ? "col-span-2"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                handleRemoveSplit(index)
                                            }
                                        >
                                            <XIcon />
                                        </Button>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </CardContent>
                    <CardFooter>
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            onClick={handleAddSplit}
                        >
                            <PlusIcon />
                            {`${t("add")} ${t("Accountant.splits")}`}
                        </Button>
                    </CardFooter>
                </Card>

                {result && <ErrorMessage error={`${String(result)}`} />}
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            {t("BeerCounter.cancel")}
                        </Button>
                    </DialogClose>
                    <Button disabled={isPending} type="submit">
                        {isPending ? <LoadingSpinner /> : t("submit")}
                    </Button>
                </DialogFooter>
            </form>
        </Form>
    );
}
