import { twMerge } from "tailwind-merge";
import { TextDocument } from "../markdown-editor/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getCurrentLocale, getI18n } from "@/locales/server";

export default async function BlogArticleHeader({
    article,
    className,
}: {
    article: TextDocument;
} & React.ComponentProps<"section">) {
    const locale = await getCurrentLocale();
    const t = await getI18n();
    return (
        <section className={twMerge(className)}>
            <header
                className={twMerge(
                    "pb-8 text-5xl! sm:text-8xl!",
                    article.status === "draft" && "opacity-60"
                )}
            >
                {`${article.title}`}
                {article.status === "draft" && (
                    <span className="text-2xl">
                        {" "}
                        [{`${article.status.toLocaleUpperCase()}`}]
                    </span>
                )}
            </header>
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
