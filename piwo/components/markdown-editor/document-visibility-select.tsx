"use client";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { TextDocumentSchema } from "./types";
import type { ControllerProps, FieldPath, FieldValues } from "react-hook-form";
import { useI18n } from "@/locales/client";

export default function DocumentVisibilitySelect<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({ ...props }: Omit<ControllerProps<TFieldValues, TName>, "render">) {
    const t = useI18n();
    return (
        <FormField
            {...props}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{t("Blog.access")}</FormLabel>
                    <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                    >
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {TextDocumentSchema.shape.access.options.map(
                                (access, key) => (
                                    <SelectItem key={key} value={access}>
                                        {access.toLocaleUpperCase()}
                                    </SelectItem>
                                )
                            )}
                        </SelectContent>
                    </Select>
                </FormItem>
            )}
        />
    );
}
