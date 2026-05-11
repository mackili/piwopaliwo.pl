"use client";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormMessage } from "./form";
import { Input } from "./input";
import { Checkbox } from "./checkbox";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "./select";
import { Popover, PopoverTrigger, PopoverContent } from "./popover";
import { Calendar } from "./calendar";
import { CalendarIcon } from "lucide-react";
import { Button } from "./button";
import { useCurrentLocale } from "@/locales/client";

export default function FormInput<T extends FieldValues>({
    form,
    name,
    label,
    type = "text",
    options,
}: {
    name: Path<T>;
    label?: string;
    form: UseFormReturn<T>;
    type?:
        | "number"
        | "checkbox"
        | "date"
        | "email"
        | "hidden"
        | "password"
        | "radio"
        | "search"
        | "tel"
        | "text"
        | "select"
        | "url";
    options?: { value: string; label?: string | React.ReactNode }[]; // For select fields
}) {
    const locale = useCurrentLocale();
    return (
        <FormField
            name={name}
            control={form.control}
            render={({ field, fieldState }) => (
                <FormItem>
                    {label && <FormLabel>{label}</FormLabel>}
                    {type === "text" && <Input type="text" {...field} />}
                    {type === "email" && <Input type="email" {...field} />}
                    {type === "password" && (
                        <Input type="password" {...field} />
                    )}
                    {type === "number" && <Input type="number" {...field} />}
                    {type === "checkbox" && (
                        <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                        />
                    )}
                    {type === "select" && options && (
                        <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select an option" />
                            </SelectTrigger>
                            <SelectContent>
                                {options.map((option, index) => (
                                    <SelectItem
                                        key={index}
                                        value={option.value}
                                    >
                                        {option?.label || option.value}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                    {type === "date" && (
                        <>
                            <Input type="hidden" {...field} />
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        data-empty={!field.value}
                                        className="w-full justify-start text-left font-normal data-[empty=true]:text-muted-foreground"
                                    >
                                        <CalendarIcon />
                                        {field.value ? (
                                            Intl.DateTimeFormat(locale, {
                                                dateStyle: "short",
                                            }).format(new Date(field.value))
                                        ) : (
                                            <span>Pick a date</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <Calendar
                                        mode="single"
                                        selected={
                                            field.value
                                                ? new Date(field.value)
                                                : undefined
                                        }
                                        onSelect={(date) =>
                                            field.onChange(date?.toISOString())
                                        }
                                    />
                                </PopoverContent>
                            </Popover>
                        </>
                    )}
                    {fieldState?.error?.message && (
                        <FormMessage>{fieldState?.error?.message}</FormMessage>
                    )}
                </FormItem>
            )}
        />
    );
}
