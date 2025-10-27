"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { ConsumedDrink, ConsumedDrinkSchema } from "./types";
import { v4 as uuid } from "uuid";
import { PostgrestError, User } from "@supabase/supabase-js";
import { DateTimePicker } from "../ui/datetime-picker";
import { Button } from "../ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { FormEvent, useState } from "react";
import { beerSizes } from "./beer-sizes";
import { twMerge } from "tailwind-merge";
import { CircleDashed } from "lucide-react";
import registerBeer from "./register-beer";
import { ZodError } from "zod";
import Beer from "./piwo";
import { useI18n } from "@/locales/client";

export default function BeerForm({
    userData,
    beer,
    onSubmit,
}: {
    userData: User;
    beer?: ConsumedDrink;
    onSubmit: (open: boolean) => void;
}) {
    const t = useI18n();
    const [isAutomaticDate, setAutomaticDate] = useState<boolean>(true);
    const [isLoading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<ZodError | PostgrestError | null>(null);
    const form = useForm<ConsumedDrink>({
        resolver: zodResolver(ConsumedDrinkSchema),
        defaultValues: {
            id: beer?.id || uuid(),
            user_id: beer?.user_id || userData.id,
            drank_at: beer?.drank_at || new Date().toISOString(),
            drink_type: beer?.drink_type || "beer",
            quantity: beer?.quantity || 500,
        },
    });
    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setLoading(true);
        const { error } = await registerBeer(form.getValues());
        setLoading(false);
        if (!error) {
            onSubmit(false);
            return;
        }
        setError(error);
    };
    return (
        <Form {...form}>
            <form
                id="new-beer-form"
                onSubmit={handleSubmit}
                className={twMerge(
                    "relative flex items-center-safe justify-center-safe w-full",
                    isLoading && "pointer-events-none opacity-50"
                )}
            >
                <div className="grid grid-cols-3 gap-4 w-full">
                    <div className="col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
                        <div className="sm:col-span-2 flex items-center-safe flex-col gap-4">
                            <Beer
                                id="beer-display"
                                className="h-full aspect-2/3"
                                milliliters={form.watch("quantity")}
                            />
                            <Label
                                className="font-serif"
                                htmlFor="beer-display"
                            >
                                {
                                    beerSizes.find(
                                        (size) =>
                                            size.value ===
                                            form.getValues("quantity")
                                    )?.name
                                }
                            </Label>
                        </div>
                        <FormField
                            control={form.control}
                            name="quantity"
                            render={({ field }) => (
                                <FormControl>
                                    <div className="col-span-1 flex flex-col gap-2">
                                        {beerSizes
                                            ?.sort((a, b) => b.value - a.value)
                                            .map((size, index) => (
                                                <Button
                                                    type="button"
                                                    variant={
                                                        field.value ===
                                                        size.value
                                                            ? "secondary"
                                                            : "ghost"
                                                    }
                                                    className={`${
                                                        field.value ===
                                                        size.value
                                                            ? "scale-105 shadow-lg bg-primary/10"
                                                            : ""
                                                    } w-full`}
                                                    size="sm"
                                                    key={index}
                                                    onClick={() =>
                                                        form.setValue(
                                                            "quantity",
                                                            size.value
                                                        )
                                                    }
                                                >
                                                    {size.label}
                                                </Button>
                                            ))}
                                    </div>
                                </FormControl>
                            )}
                        />
                    </div>
                    <div className="col-span-1 flex flex-col gap-4">
                        <div className="flex flex-row w-full"></div>
                        <FormField
                            control={form.control}
                            name="drink_type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        {t("BeerCounter.drinkType")}
                                    </FormLabel>
                                    <FormControl>
                                        <Select {...field}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="beer">
                                                    {t("beer")}
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="drank_at"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        {t("BeerCounter.drankAt")}
                                    </FormLabel>
                                    <FormControl>
                                        <DateTimePicker
                                            className="flex-col gap-2"
                                            // @ts-expect-error too general of a definition
                                            field={field}
                                            useAutomaticDate={isAutomaticDate}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="isAutomatic"
                                onCheckedChange={(checked: boolean) =>
                                    setAutomaticDate(checked)
                                }
                                defaultChecked={isAutomaticDate}
                            />
                            <Label htmlFor="isAutomatic">
                                {isAutomaticDate
                                    ? t("BeerCounter.autoDate")
                                    : t("BeerCounter.manualDate")}
                            </Label>
                        </div>
                    </div>
                </div>
                {isLoading && (
                    <div className="absolute w-full h-full flex items-center-safe justify-center-safe">
                        <CircleDashed className="opacity-100 animate-spin" />
                    </div>
                )}
            </form>
            {error && <p className="text-red-700">{error.message}</p>}
        </Form>
    );
}
