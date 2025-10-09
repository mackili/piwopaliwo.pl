import Image from "next/image";
import { TextDocument } from "../markdown-editor/types";

export default function BlogArticleBanner({
    article,
}: {
    article: TextDocument;
}) {
    if (!article?.banner_url) {
        return <div className="h-16"></div>;
    }
    return <Image src={article.banner_url} alt="Banner" />;
}
