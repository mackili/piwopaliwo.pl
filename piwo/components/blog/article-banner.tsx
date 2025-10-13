import Image from "next/image";
import { TextDocument } from "../markdown-editor/types";
import { twMerge } from "tailwind-merge";

export default function BlogArticleBanner({
    article,
}: {
    article: TextDocument;
}) {
    return (
        <div
            className={twMerge(
                "min-h-16 flex w-full relative",
                article?.banner_url && "aspect-3/2"
            )}
        >
            {article?.banner_url && (
                <Image
                    src={article.banner_url}
                    alt="Banner"
                    className="w-full h-full object-cover"
                    fill
                    priority
                />
            )}
        </div>
    );
}
