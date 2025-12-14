"use client";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { GroupMember, GroupMemberSchema } from "../../types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import ErrorMessage from "@/components/ui/error-message";
import { ComponentProps, useActionState } from "react";
import { twMerge } from "tailwind-merge";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useRouter } from "next/navigation";
import { v4 as uuid } from "uuid";
import { upsertGroupMember } from "./upsert-group-member";
import PostgrestErrorDisplay from "@/components/ui/postgrest-error-display";

export default function GroupMemberForm({
    data,
    setDialogOpen,
    ...props
}: {
    data: GroupMember;
    setDialogOpen: (open: boolean) => void;
} & ComponentProps<"form">) {
    const router = useRouter();
    const [result, handleSubmit, isPending] = useActionState(
        handleGroupMemberSave,
        null
    );
    const form = useForm<GroupMember>({
        resolver: zodResolver(GroupMemberSchema),
        defaultValues: {
            ...data,
            id: data.id.length <= 0 ? uuid() : data.id,
        },
    });

    async function handleGroupMemberSave() {
        const isValid = await form.trigger();
        if (isValid === false) {
            return;
        }
        const groupMemberData = form.getValues();
        if (Object.keys(groupMemberData).includes("user")) {
            delete groupMemberData.user;
        }
        const result = await upsertGroupMember(groupMemberData);
        if (result.data) {
            router.refresh();
            setDialogOpen(false);
        } else {
            return result.error;
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
                    name="nickname"
                    render={({ field, fieldState }) => (
                        <FormItem>
                            <FormLabel>Nickname</FormLabel>
                            <Input type="text" {...field} />
                            {fieldState.invalid && (
                                <ErrorMessage
                                    error={fieldState?.error?.message || ""}
                                />
                            )}
                        </FormItem>
                    )}
                />

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
