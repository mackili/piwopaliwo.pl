import BlogArticle from "@/components/blog/blog-article";
import { fetchArticle } from "./fetch";
import { getAuthorUser } from "../../fetch";
import Link from "next/link";
import { getCurrentLocale, getI18n } from "@/locales/server";
import { Button } from "@/components/ui/button";
import CommentSection from "./(comments)/comment-section";

export default async function Page({
    params,
}: {
    params: Promise<{ article: string }>;
}) {
    const { article } = await params;
    const { documentData, parseError } = await fetchArticle(article);
    const { isAuthorUser, user } = await getAuthorUser();
    const locale = await getCurrentLocale();
    const t = await getI18n();
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
            {isAuthorUser && user?.data?.user?.id === documentData.author && (
                <Link href={`/${locale}/blog/write?id=${documentData.id}`}>
                    <Button variant="outline" className="mb-8">
                        {t("Blog.edit")}
                    </Button>
                </Link>
            )}
            <BlogArticle article={documentData} />
            <CommentSection articleId={article} user={user} />
        </section>
    );
}
