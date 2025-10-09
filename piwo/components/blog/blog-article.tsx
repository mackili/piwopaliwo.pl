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
        <div>
            <BlogArticleHeader article={article} />
            <BlogArticleBanner article={article} />
            <BlogArticleBody article={article} />
        </div>
    );
}
