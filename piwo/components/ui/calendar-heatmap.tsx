import { ComponentProps } from "react";
import { Calendar } from "./calendar";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

function getDynamicWeightClass(
    weight: number,
    min: number,
    max: number,
    bgClasses: string[]
) {
    if (max === min) return bgClasses[bgClasses.length - 1];
    const step = (max - min) / (bgClasses.length - 1);
    for (let i = bgClasses.length - 1; i >= 0; i--) {
        if (weight >= min + i * step) {
            return bgClasses[i];
        }
    }
    return bgClasses[0];
}

export default function CalendarHeatmap({
    className,
    values = [],
    variantClassnames,
}: ComponentProps<"div"> & {
    values?: { date: Date; weight: number }[];
    variantClassnames: string[];
}) {
    const modifiers: Record<string, Date[]> = {};
    const modifiersClassNames: Record<string, string> = {};
    const weights = values.map((v) => v.weight);
    const min = Math.min(...weights);
    const max = Math.max(...weights);

    values.forEach(({ date, weight }) => {
        const key = `weight_${weight}`;
        if (!modifiers[key]) modifiers[key] = [];
        modifiers[key].push(date);
        modifiersClassNames[key] = getDynamicWeightClass(
            weight,
            min,
            max,
            variantClassnames
        );
    });
    return (
        <Calendar
            className={className}
            modifiers={modifiers}
            modifiersClassNames={modifiersClassNames}
            classNames={{
                week: "grid grid-cols-7 w-full gap-2 aspect-7/1 py-1",
                day: cn(
                    buttonVariants({ variant: "ghost" }),
                    "flex p-0 font-normal aria-selected:opacity-100 aspect-square h-full w-full"
                ),
                today: "font-bold",
            }}
        />
    );
}
