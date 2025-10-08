"use client";
import { Marked } from "marked";
import { twMerge } from "tailwind-merge";

export default function MarkdownPreview({
    markdown,
    className,
    ...props
}: {
    markdown: string | null | undefined;
} & React.ComponentProps<"div">) {
    const marked = new Marked();
    const html = marked.parse(markdown || "", { async: false });
    return (
        <div
            className={twMerge(
                "bg-accent/60 p-4 rounded-xl shadow-lg dark:ring dark:ring-primary/30 border-secondary",
                className
            )}
            {...props}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}
