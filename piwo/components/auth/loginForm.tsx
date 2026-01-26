"use client";
import { login } from "@/app/[locale]/(with-navbar)/auth/login/actions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserSchema, User } from "./types";
import { useI18n } from "@/locales/client";

export default function LoginPage() {
    const t = useI18n();
    const loginForm = useForm<User>({
        resolver: zodResolver(UserSchema),
        defaultValues: { email: "", password: "" },
    });
    return (
        <Form {...loginForm}>
            <form
                className="flex gap-4 flex-col w-full flex-nowrap"
                onSubmit={loginForm.handleSubmit(login)}
            >
                <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    type="email"
                                    placeholder="example@piwopaliwo.pl"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t("password")}</FormLabel>
                            <FormControl>
                                <Input
                                    type="password"
                                    placeholder="******"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" variant="secondary">
                    {t("logIn")}
                </Button>
            </form>
        </Form>
    );
}
