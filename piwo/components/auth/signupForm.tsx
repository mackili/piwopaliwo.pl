"use client";
import { signup } from "@/app/[locale]/auth/login/actions";
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

export default function SignUpPage() {
    const signUpForm = useForm<User>({
        resolver: zodResolver(UserSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
        },
    });
    return (
        <Form {...signUpForm}>
            <form
                className="flex gap-4 flex-col w-full flex-nowrap"
                onSubmit={signUpForm.handleSubmit(signup)}
            >
                <FormField
                    control={signUpForm.control}
                    name="firstName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Imię</FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    placeholder="John"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={signUpForm.control}
                    name="lastName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nazwisko</FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    placeholder="Smith"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={signUpForm.control}
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
                    control={signUpForm.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Hasło</FormLabel>
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
                <Button type="submit">Sign Up</Button>
            </form>
        </Form>
    );
}
