import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

export default function DetailField({
    detailName,
    detailValue,
    detailLabel,
    className,
    ...props
}: {
    detailName: string;
    detailValue: string;
    detailLabel?: string;
} & ComponentProps<"div">) {
    return (
        <div className={twMerge("space-y-1", className)} {...props}>
            <p className="font-medium text-xs text-muted-foreground">
                {detailLabel ? detailLabel : detailName}
            </p>
            <p className="font-semibold text-sm text-primary">{detailValue}</p>
        </div>
    );
}
