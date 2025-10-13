import { twMerge } from "tailwind-merge";
import { TextDocument } from "../markdown-editor/types";
import BlogArticleHeader from "./article-header";
import Image from "next/image";

export default function BlogTile({
    article,
    className,
}: { article: TextDocument } & React.ComponentProps<"div">) {
    return (
        <div
            className={twMerge(
                "flex flex-col w-full gap-12 p-4 md:p-8",
                "antialiased backdrop-blur-xs shadow-lg",
                className
            )}
        >
            {article?.thumbnail_url ? (
                <div className="flex w-full aspect-2/3 relative">
                    <Image
                        src={article.thumbnail_url}
                        alt={article.title || article.id}
                        className="w-full h-full object-cover"
                        fill
                        priority
                    />
                </div>
            ) : (
                <div className="w-full aspect-2/3 border-2 border-secondary bg-repeat bg-accent/20 flex items-center-safe justify-center-safe">
                    <code className="p-2 rounded-lg bg-accent/80 select-none">
                        no photo
                    </code>
                </div>
            )}
            <BlogArticleHeader article={article} className="mb-0" />
        </div>
    );
}
