"use server";

import BlogTile from "@/components/blog/blog-tile";
import { fetchArticles, getAuthorUser } from "./fetch";
import Link from "next/link";
import { getCurrentLocale, getI18n } from "@/locales/server";
import { Button } from "@/components/ui/button";

export default async function BlogSection() {
    const { documentData, parseError } = await fetchArticles();
    const locale = await getCurrentLocale();
    const t = await getI18n();
    const { isAuthorUser } = await getAuthorUser();
    return (
        <div className="w-full">
            <div className="py-8 flex items-center-safe justify-between">
                <header>
                    <Link href={`/${locale}/blog`}>Blog</Link>
                </header>
                {isAuthorUser && (
                    <Link href={`/${locale}/blog/write`}>
                        <Button type="button" variant="outline" size="lg">
                            {t("Blog.newArticle")}
                        </Button>
                    </Link>
                )}
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 w-full gap-4">
                {documentData ? (
                    documentData.map(
                        (
                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                            { created_at, ...article },
                            index
                        ) => (
                            <Link
                                className="cursor-pointer"
                                href={`/${locale}/blog/read/${article.id}`}
                                key={index}
                            >
                                <BlogTile
                                    article={article}
                                    className="flex aspect-2/3 [&_header]:text-5xl! [&_header]:font-normal! [&_h4]:text-md! [&_h4]:font-light! [&_p]:text-xs! [&_p]:font-extralight! justify-end-safe items-start"
                                />
                            </Link>
                        )
                    )
                ) : (
                    <p className="text-2xl font-bold text-red-700">
                        {parseError?.message}
                    </p>
                )}
            </div>
        </div>
    );
}
