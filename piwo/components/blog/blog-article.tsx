import { TextDocument } from "../markdown-editor/types";
import BlogArticleBanner from "./article-banner";
import BlogArticleBody from "./article-body";
import BlogArticleHeader from "./article-header";

export default async function BlogArticle({
    article,
}: {
    article: TextDocument;
}) {
    return (
        <div className="grid grid-cols-1 gap-16">
            <BlogArticleHeader article={article} />
            <BlogArticleBanner article={article} />
            <BlogArticleBody article={article} />
        </div>
    );
}
