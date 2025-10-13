"use client";
import { useForm } from "react-hook-form";
import {
    Form,
    FormField,
    FormLabel,
    FormItem,
    FormControl,
} from "@/components/ui/form";
import { UserInfoSchema } from "@/components/auth/types";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import { UserResponse, UserAttributes } from "@supabase/supabase-js";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/locales/client";

export default function UserDetails({ user }: { user: UserResponse }) {
    const supabase = createClient();
    const t = useI18n();

    const userForm = useForm<z.infer<typeof UserInfoSchema>>({
        resolver: zodResolver(UserInfoSchema),
        defaultValues: {
            firstName: user.data.user?.user_metadata?.firstName || "",
            lastName: user.data.user?.user_metadata?.lastName || "",
            userId: user.data.user?.id,
        },
    });

    const handleSubmit = (formData: z.infer<typeof UserInfoSchema>) => {
        const newData: UserAttributes = {
            data: {
                firstName: formData.firstName,
                lastName: formData.lastName,
            },
        };
        supabase.auth.updateUser(newData);
    };
    return (
        <Form {...userForm}>
            <form
                className="gap-8 flex flex-col"
                onSubmit={userForm.handleSubmit(handleSubmit)}
            >
                <FormField
                    control={userForm.control}
                    name="firstName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t("Settings.firstName")}</FormLabel>
                            <FormControl>
                                <Input placeholder="Name" {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={userForm.control}
                    name="lastName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t("Settings.lastName")}</FormLabel>
                            <FormControl>
                                <Input placeholder="Last Name" {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button type="submit">{t("Settings.updateData")}</Button>
            </form>
        </Form>
    );
}
