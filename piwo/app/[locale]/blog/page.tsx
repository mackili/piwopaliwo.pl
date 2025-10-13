"use server";

import BlogTile from "@/components/blog/blog-tile";
import { fetchArticles } from "./fetch";
import Link from "next/link";
import { getCurrentLocale } from "@/locales/server";

export default async function BlogSection() {
    const { documentData, parseError } = await fetchArticles();
    const locale = await getCurrentLocale();
    return (
        <div className="w-full">
            <header className="py-8">
                <Link href={`/${locale}/blog`}>Blog</Link>
            </header>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 w-full gap-4">
                {documentData &&
                    documentData.map(({ created_at, ...article }, index) => (
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
                    ))}
            </div>
        </div>
    );
}
