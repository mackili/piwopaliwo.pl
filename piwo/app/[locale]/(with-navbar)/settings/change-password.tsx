"use client";
import { useI18n } from "@/locales/client";
import { passwordRequirements, passwordSchema } from "@/components/auth/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Form,
    FormField,
    FormLabel,
    FormItem,
    FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Ban, CircleCheck, CircleX, Pen, PenOff } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

const formSchema = z
    .object({
        // oldPassword: passwordSchema,
        newPassword: passwordSchema,
        repeatPassword: passwordSchema,
    })
    .refine(
        (values) => {
            return values.newPassword === values.repeatPassword;
        },
        {
            message: "Settings.repeatPassword",
            path: ["repeatPassword"],
        }
    );

export default function ChangePasswordForm() {
    const t = useI18n();
    const supabase = createClient();
    const [formState, setFormState] = useState<"inactive" | "active" | "error">(
        "inactive"
    );
    const router = useRouter();

    const passwordForm = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            // oldPassword: "",
            newPassword: "",
            repeatPassword: "",
        },
        disabled: formState === "inactive",
        reValidateMode: "onChange",
    });
    const newPassword = passwordForm.watch("newPassword");
    const repeatPassword = passwordForm.watch("repeatPassword");

    const handleSubmit = (formData: z.infer<typeof formSchema>) => {
        supabase.auth.updateUser({ password: formData.newPassword });
        setFormState("inactive");
        router.refresh();
    };
    return (
        <div className="relative">
            <h3 className="mb-4">{t("password")}</h3>
            <Form {...passwordForm}>
                <form
                    className="flex flex-col gap-4"
                    onSubmit={passwordForm.handleSubmit(handleSubmit)}
                >
                    <FormField
                        control={passwordForm.control}
                        name="newPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    {t("Settings.newPassword")}
                                </FormLabel>
                                <div className="flex gap-2">
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="*****"
                                            {...field}
                                        />
                                    </FormControl>
                                    <Button
                                        type="button"
                                        onClick={() =>
                                            setFormState(
                                                formState === "inactive"
                                                    ? "active"
                                                    : "inactive"
                                            )
                                        }
                                        variant="outline"
                                    >
                                        {formState === "inactive" ? (
                                            <PenOff />
                                        ) : formState === "active" ? (
                                            <Pen />
                                        ) : (
                                            <CircleX />
                                        )}
                                    </Button>
                                </div>
                            </FormItem>
                        )}
                    />
                    <div
                        className={`flex flex-col gap-4 relative transition-all ease-in-out ${
                            formState === "inactive" &&
                            "opacity-0 select-none hidden"
                        }`}
                    >
                        <FormField
                            control={passwordForm.control}
                            name="repeatPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        {t("Settings.repeatPassword")}
                                    </FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <Button type="submit" variant="default">
                            {t("Settings.changePassword")}
                        </Button>

                        <div className="flex gap-2 flex-col">
                            {passwordRequirements.map((requirement, index) => (
                                <p key={index} className="flex gap-2">
                                    {requirement.pattern.test(newPassword) ? (
                                        <CircleCheck />
                                    ) : (
                                        <Ban />
                                    )}

                                    {
                                        // @ts-expect-error messages are in the locale files
                                        t(requirement.message)
                                    }
                                </p>
                            ))}
                            <p className="flex gap-2 max-w-[300px]">
                                <span>
                                    {repeatPassword === newPassword &&
                                    newPassword !== "" ? (
                                        <CircleCheck />
                                    ) : (
                                        <Ban />
                                    )}
                                </span>{" "}
                                {t("PasswordRequirements.matchRepeat")}
                            </p>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
}
