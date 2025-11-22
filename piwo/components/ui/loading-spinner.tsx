import { CircleDashedIcon } from "lucide-react";
import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

export default function LoadingSpinner({ className }: ComponentProps<"div">) {
    return <CircleDashedIcon className={twMerge("animate-spin", className)} />;
}
