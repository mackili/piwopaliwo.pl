"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { ControllerRenderProps } from "react-hook-form";
import { useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";

// Helper to split datetime string into date and time
function splitDateTime(value?: number) {
    if (!value) return { date: undefined, time: "" };
    const d = new Date(value);
    if (isNaN(d.getTime())) return { date: undefined, time: "" };
    const date = d;
    const time = d.toTimeString().slice(0, 8); // "HH:MM:SS"
    return { date, time };
}

// Helper to combine date and time into ISO string
function combineDateTime(date?: Date, time?: string) {
    if (!date || !time) return "";
    const [h, m, s] = time.split(":");
    const d = new Date(date);
    d.setHours(Number(h), Number(m), Number(s || 0), 0);
    return d.toISOString();
}

export function DateTimePicker({
    field,
    useAutomaticDate = true,
    className,
}: {
    field: ControllerRenderProps;
    useAutomaticDate?: boolean;
    className?: string;
}) {
    const { date: initialDate, time: initialTime } = splitDateTime(field.value);
    const [date, setDate] = useState<Date | undefined>(initialDate);
    const [time, setTime] = useState<string>(initialTime);
    const [open, setOpen] = useState(false);
    const [currentDate, setCurrentDate] = useState<number>(Date.now());
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentDate(Date.now());
        }, 1000);
        return () => clearInterval(interval);
    }, []);
    useEffect(() => {
        if (useAutomaticDate && currentDate) {
            const { date: newDate, time: newTime } = splitDateTime(currentDate);
            setDate(newDate);
            setTime(newTime);
            field.onChange(combineDateTime(newDate, newTime));
        }
    }, [currentDate, useAutomaticDate, field]);

    return (
        <div className={twMerge("flex gap-4", className)}>
            <div className="flex flex-col gap-3">
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            id="date-picker"
                            className=" justify-between font-normal"
                            disabled={useAutomaticDate}
                        >
                            {date ? date.toLocaleDateString() : "Select date"}
                            <ChevronDownIcon />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        className="w-auto overflow-hidden p-0"
                        align="start"
                    >
                        <Calendar
                            mode="single"
                            selected={date}
                            captionLayout="dropdown"
                            onSelect={(date) => {
                                setDate(date);
                                setOpen(false);
                            }}
                        />
                    </PopoverContent>
                </Popover>
            </div>
            <div className="flex flex-col gap-3">
                <Input
                    type="time"
                    id="time-picker"
                    step="1"
                    className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    disabled={useAutomaticDate}
                />
            </div>
        </div>
    );
}
