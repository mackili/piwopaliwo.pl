"use server";
import { fetchArticle } from "../read/[article]/fetch";
import MarkdownEditor from "@/components/markdown-editor/markdown-editor";
import { TextDocumentSchema } from "@/components/markdown-editor/types";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { v4 as uuid } from "uuid";
import { getCurrentLocale } from "@/locales/server";

export default async function Page({
    searchParams,
}: {
    searchParams: Promise<{ id: string | null | undefined }>;
}) {
    const { id } = await searchParams;
    console.log(id);
    const supabase = await createClient();
    const user = await supabase.auth.getUser();
    const locale = await getCurrentLocale();
    if (!id) {
        const newDocumentId = uuid();
        const { error } = await supabase.from("TextDocument").insert(
            TextDocumentSchema.safeParse({
                id: newDocumentId,
                author: user.data.user?.id,
                access: "restricted",
                status: "draft",
                document_type: "blog",
            }).data
        );
        if (error) {
            console.error(error);
            redirect(`/${locale}/blog`);
        } else {
            redirect(`/${locale}/blog/write?id=${newDocumentId}`);
        }
    }
    const { documentData, parseError } = await fetchArticle(id);
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
            <MarkdownEditor textDocument={documentData} />
        </section>
    );
}
