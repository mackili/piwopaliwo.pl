"use client";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import {
    GroupMember,
    GroupMemberSchema,
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
import { getAvailableUsers, upsertGroupMember } from "./upsert-group-member";
import PostgrestErrorDisplay from "@/components/ui/postgrest-error-display";
import UserSelect from "@/components/ui/user-dropdown";
import { UserInfo } from "@/components/scoretracker/types";
import { PostgrestError } from "@supabase/supabase-js";
import { useI18n } from "@/locales/client";

export default function GroupMemberForm({
    data,
    setDialogOpen,
    ...props
}: {
    data: GroupMember;
    setDialogOpen: (open: boolean) => void;
} & ComponentProps<"form">) {
    const t = useI18n();
    const router = useRouter();
    const [users, setUsers] = useState<UserInfo[]>([]);
    const [usersError, setUsersError] = useState<PostgrestError>();
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

    useEffect(() => {
        const setUserData = async () => {
            const { data, error } = await getAvailableUsers();
            if (error) {
                setUsersError(error as PostgrestError);
            } else {
                setUsers(data || []);
            }
        };
        setUserData();
    }, []);
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
                            <FormLabel>{t("Accountant.nickname")}</FormLabel>
                            <Input type="text" {...field} />
                            {fieldState.invalid && (
                                <ErrorMessage
                                    error={fieldState?.error?.message || ""}
                                />
                            )}
                        </FormItem>
                    )}
                />
                {users && (
                    <FormField
                        control={form.control}
                        name="user_id"
                        render={({ field, fieldState }) => (
                            <FormItem className="w-full">
                                <FormLabel>{t("user")}</FormLabel>
                                <UserSelect
                                    name={field.name}
                                    value={field.value || undefined}
                                    users={users}
                                    onValueChange={field.onChange}
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
                )}
                {usersError && <PostgrestErrorDisplay error={usersError} />}
                <PostgrestErrorDisplay error={result} />
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
