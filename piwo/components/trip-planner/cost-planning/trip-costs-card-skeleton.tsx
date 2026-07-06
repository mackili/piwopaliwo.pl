"use client";

import { ComponentProps } from "react";
import {
    Card,
    CardAction,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { twMerge } from "tailwind-merge";
import { Skeleton } from "@/components/ui/skeleton";

export const INITIAL_TRANSACTIONS_LIMIT = 10 as const;

export default function TripCostsCardSkeleton({
    className,
    ...props
}: ComponentProps<"div">) {
    return <Skeleton className="w-full h-48 col-span-full"></Skeleton>;
}
