"use client";
import { Marked } from "marked";
import { twMerge } from "tailwind-merge";
import { emojify } from "node-emoji";

export default function MarkdownPreview({
    markdown,
    className,
    ...props
}: {
    markdown: string | null | undefined;
} & React.ComponentProps<"div">) {
    const marked = new Marked();
    const emojiMarkdown = emojify(markdown || "");
    // const html = marked.parse(markdown || "", { async: false });
    const html = marked.parse(emojiMarkdown || "", { async: false });
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
