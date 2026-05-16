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
import { ComponentProps } from "react";

export default function FormInput<T extends FieldValues>({
    form,
    name,
    label,
    type = "text",
    options,
    step,
    placeholder,
    className,
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
        | "url"
        | "date-time";
    options?: { value: string; label?: string | React.ReactNode }[]; // For select fields
    step?: string;
    placeholder?: string;
} & ComponentProps<"div">) {
    const locale = useCurrentLocale();
    return (
        <FormField
            name={name}
            control={form.control}
            render={({ field, fieldState }) => (
                <FormItem className={className}>
                    {label && <FormLabel>{label}</FormLabel>}
                    {type === "text" && (
                        <Input
                            type="text"
                            {...field}
                            placeholder={placeholder}
                        />
                    )}
                    {type === "email" && (
                        <Input
                            type="email"
                            {...field}
                            placeholder={placeholder}
                        />
                    )}
                    {type === "password" && (
                        <Input
                            type="password"
                            {...field}
                            placeholder={placeholder}
                        />
                    )}
                    {type === "number" && (
                        <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                                field.onChange(
                                    e.target.value
                                        ? Number(e.target.value)
                                        : undefined,
                                )
                            }
                            step={step}
                            placeholder={placeholder}
                        />
                    )}
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
                    {type === "date-time" && (
                        <div className="flex-row gap-2 flex w-full">
                            <Input type="hidden" {...field} />
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        data-empty={!field.value}
                                        className="grow min-w-64 justify-start text-left font-normal data-[empty=true]:text-muted-foreground"
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
                                        onSelect={(date) => {
                                            if (!date)
                                                return field.onChange(
                                                    undefined,
                                                );
                                            const time = field.value
                                                ? new Date(field.value)
                                                      .toTimeString()
                                                      .slice(0, 8)
                                                : "00:00:00";
                                            const merged = new Date(
                                                `${date.toDateString()} ${time}`,
                                            );
                                            field.onChange(
                                                merged.toISOString(),
                                            );
                                        }}
                                    />
                                </PopoverContent>
                            </Popover>
                            <Input
                                type="time"
                                step="1"
                                className="shrink"
                                value={
                                    field.value
                                        ? new Date(field.value)
                                              .toTimeString()
                                              .slice(0, 8)
                                        : ""
                                }
                                onChange={(e) => {
                                    const time = e.target.value; // "HH:mm:ss"
                                    const base = field.value
                                        ? new Date(field.value)
                                        : new Date();
                                    const merged = new Date(
                                        `${base.toDateString()} ${time}`,
                                    );
                                    field.onChange(merged.toISOString());
                                }}
                            />
                        </div>
                    )}
                    {fieldState?.error?.message && (
                        <FormMessage>{fieldState?.error?.message}</FormMessage>
                    )}
                </FormItem>
            )}
        />
    );
}
