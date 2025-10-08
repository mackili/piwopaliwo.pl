"use client";
import { Input } from "../ui/input";
import { FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import type { ControllerProps, FieldPath, FieldValues } from "react-hook-form";
import { useI18n } from "@/locales/client";

export default function DocumentTitle<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({ ...props }: Omit<ControllerProps<TFieldValues, TName>, "render">) {
    const t = useI18n();
    return (
        <FormField
            {...props}
            render={({ field }) => (
                <FormItem className="grow">
                    <FormLabel>{t("TextEditor.title")}</FormLabel>
                    <FormControl>
                        <Input {...field}></Input>
                    </FormControl>
                </FormItem>
            )}
        />
    );
}
