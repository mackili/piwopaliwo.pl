"use client";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { DocumentStatusEnum } from "../texteditor/types";
import type { ControllerProps, FieldPath, FieldValues } from "react-hook-form";

export default function DocumentStatusSelect<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({ ...props }: Omit<ControllerProps<TFieldValues, TName>, "render">) {
    return (
        <FormField
            {...props}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Status</FormLabel>
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
                            {DocumentStatusEnum.options.map((status, key) => (
                                <SelectItem key={key} value={status}>
                                    {status.toLocaleUpperCase()}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </FormItem>
            )}
        />
    );
}
