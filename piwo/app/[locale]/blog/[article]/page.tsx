import BlogArticle from "@/components/blog/blog-article";
import { fetchArticle } from "./fetch";

export default async function Page({
    params,
}: {
    params: Promise<{ article: string }>;
}) {
    const { article } = await params;
    const { documentData, parseError } = await fetchArticle(article);
    if (parseError) {
        return (
            <div className="text-red-600">
                {parseError.message || "Error loading article."}
            </div>
        );
    }

    if (!documentData) {
        return <div className="text-gray-600">Article not found.</div>;
    }
    return (
        <section className="mx-4 sm:mx-8 md:mx-32 lg:mx-40">
            <BlogArticle article={documentData} />
        </section>
    );
}
