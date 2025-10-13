import { TextDocument } from "../markdown-editor/types";
import { MDXRemote, MDXRemoteOptions } from "next-mdx-remote-client/rsc";
import remarkEmoji from "remark-emoji";
import { twMerge } from "tailwind-merge";
const options: MDXRemoteOptions = {
    mdxOptions: {
        remarkPlugins: [remarkEmoji],
    },
};
// const PROSE_STYLING = [
//     "prose-headings:font-bold",
//     "prose-headings:leading-tight",
//     "prose-headings:mt-10",
//     "prose-headings:mb-4",
//     "prose-h1:text-4xl",
//     "prose-h2:text-3xl",
//     "prose-h3:text-2xl",
//     "prose-h4:text-xl",
//     "prose-lead:text-lg",
//     "prose-lead:text-muted-foreground",
//     "prose-p:my-5",
//     "prose-p:text-base",
//     "prose-p:leading-relaxed",
//     "prose-a:font-medium",
//     "prose-a:underline",
//     "prose-a:underline-offset-2",
//     "prose-a:transition-colors",
//     "prose-a:text-primary",
//     "hover:prose-a:text-accent",
//     "prose-blockquote:border-l-4",
//     "prose-blockquote:border-primary",
//     "prose-blockquote:bg-muted",
//     "prose-blockquote:pl-4",
//     "prose-blockquote:italic",
//     "prose-blockquote:text-muted-foreground",
//     "prose-blockquote:my-8",
//     "prose-figure:my-8",
//     "prose-figcaption:text-sm",
//     "prose-figcaption:text-muted-foreground",
//     "prose-figcaption:text-center",
//     "prose-strong:font-semibold",
//     "prose-em:italic",
//     "prose-kbd:bg-muted",
//     "prose-kbd:rounded",
//     "prose-kbd:px-2",
//     "prose-kbd:py-0.5",
//     "prose-kbd:text-sm",
//     "prose-kbd:font-mono",
//     "prose-code:bg-muted",
//     "prose-code:text-accent",
//     "prose-code:px-2",
//     "prose-code:py-0.5",
//     "prose-code:rounded",
//     "prose-code:text-sm",
//     "prose-code:font-mono",
//     "prose-pre:bg-muted",
//     "prose-pre:text-accent-foreground",
//     "prose-pre:p-4",
//     "prose-pre:rounded-lg",
//     "prose-pre:text-sm",
//     "prose-pre:font-mono",
//     "prose-pre:overflow-x-auto",
//     "prose-ol:pl-6",
//     "prose-ul:pl-6",
//     "prose-li:my-2",
//     "prose-dl:my-6",
//     "prose-dt:font-semibold",
//     "prose-dd:ml-4",
//     "prose-table:w-full",
//     "prose-table:border-collapse",
//     "prose-th:font-semibold",
//     "prose-th:bg-muted",
//     "prose-th:border-b-2",
//     "prose-th:border-border",
//     "prose-th:px-4",
//     "prose-th:py-2",
//     "prose-td:border-b",
//     "prose-td:border-border",
//     "prose-td:px-4",
//     "prose-td:py-2",
//     "prose-img:rounded-xl",
//     "prose-img:my-8",
//     "prose-picture:my-8",
//     "prose-video:my-8",
//     "prose-hr:border-0",
//     "prose-hr:h-1",
//     "prose-hr:bg-border",
//     "prose-hr:my-12",
// ];

export default function BlogArticleBody({
    article,
}: {
    article: TextDocument;
}) {
    return (
        <section className="flex justify-center-safe">
            <article
                className={twMerge(
                    "prose prose-zinc dark:prose-invert prose-beer beer:prose-beer max-w-[1000px]",
                    "md:prose-lg! prose-sm!"
                    // PROSE_STYLING.join(",")
                )}
            >
                <MDXRemote source={article?.markdown || ""} options={options} />
            </article>
        </section>
    );
}
