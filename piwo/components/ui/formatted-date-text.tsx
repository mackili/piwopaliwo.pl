"use client";

import { ComponentProps } from "react";

export default function FormattedDateText({
    locale,
    date,
    format,
    ...props
}: {
    date: Date;
    locale?: string;
    format?: Intl.DateTimeFormatOptions;
} & ComponentProps<"span">) {
    return (
        <span {...props}>
            {Intl.DateTimeFormat(locale, format).format(date)}
        </span>
    );
}
