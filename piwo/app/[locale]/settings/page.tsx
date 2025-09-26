"use client";
import { useForm } from "react-hook-form";
import {
    Form,
    FormField,
    FormLabel,
    FormItem,
    FormControl,
} from "@/components/ui/form";
import { UserMetadataSchema } from "@/components/auth/types";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { UserResponse, UserAttributes } from "@supabase/supabase-js";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CurrentUserAvatar } from "@/components/current-user-avatar";

export default function Settings() {
    const supabase = createClient();
    const [userData, setUserData] = useState<UserResponse | undefined>();

    useEffect(() => {
        const fetchUser = async () => {
            const user = await supabase.auth.getUser();
            setUserData(user);
        };
        fetchUser();
    }, [supabase]);

    const userForm = useForm<z.infer<typeof UserMetadataSchema>>({
        resolver: zodResolver(UserMetadataSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
        },
    });

    useEffect(() => {
        if (userData?.data.user) {
            userForm.reset({
                firstName: userData.data.user.user_metadata?.firstName || "",
                lastName: userData.data.user.user_metadata?.lastName || "",
                email: userData.data.user.email || "",
            });
        }
    }, [userData, userForm]);

    const handleSubmit = (formData: z.infer<typeof UserMetadataSchema>) => {
        const newData: UserAttributes = {
            data: {
                firstName: formData.firstName,
                lastName: formData.lastName,
            },
        };
        if (formData.email !== userData?.data.user?.email) {
            newData.email = formData.email;
        }
        supabase.auth.updateUser(newData);
    };
    return (
        <div className="h-screen flex items-center-safe flex-col gap-12 justify-center-safe">
            <CurrentUserAvatar className="w-32 h-32 font-extrabold text-2xl" />
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
                                <FormLabel>Imię</FormLabel>
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
                                <FormLabel>Nazwisko</FormLabel>
                                <FormControl>
                                    <Input placeholder="Last Name" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={userForm.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="Email" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Zaktualizuj dane</Button>
                </form>
            </Form>
        </div>
    );
}
