import { TextDocument } from "../markdown-editor/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getCurrentLocale, getI18n } from "@/locales/server";

export default async function BlogArticleHeader({
    article,
}: {
    article: TextDocument;
}) {
    const locale = await getCurrentLocale();
    const t = await getI18n();
    return (
        <section className="mb-8">
            <header className="pb-8">{article.title}</header>
            <div className="flex flex-row items-center-safe justify-between">
                <div className="flex flex-row gap-4 items-center-safe">
                    <Avatar className="w-12 h-12">
                        <AvatarImage
                            src={article?.authorData?.avatarUrl || ""}
                        />
                        <AvatarFallback>{`${article.authorData?.firstName} ${article.authorData?.lastName}`}</AvatarFallback>
                    </Avatar>
                    <h4 className="font-serif">{`${article.authorData?.firstName} ${article.authorData?.lastName}`}</h4>
                </div>
                {article.created_at && (
                    <p className="italic font-normal">
                        {`${t("Blog.published")} ${new Date(
                            article.created_at
                        ).toLocaleDateString(locale)}`}
                    </p>
                )}
            </div>
        </section>
    );
}
