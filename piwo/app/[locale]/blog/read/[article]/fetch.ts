import {
    TextDocument,
    TextDocumentSchema,
} from "@/components/markdown-editor/types";
import { createClient } from "@/lib/supabase/server";
import { PostgrestError } from "@supabase/supabase-js";
import z from "zod";

export async function fetchArticle(articleId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("TextDocument")
        .select(
            "id,title,author,status,created_at,document_type,access,markdown,thumbnail_url,banner_url,authorData:UserInfo!TextDocument_author_fkey1(*)"
        )
        .eq("id", articleId)
        .limit(1)
        .single();
    let documentData: TextDocument | null = null;
    let parseError: z.ZodError | PostgrestError | null = null;

    if (data) {
        const parseResult = await TextDocumentSchema.safeParseAsync(data);
        if (parseResult.success) {
            documentData = parseResult.data;
        } else {
            parseError = parseResult.error;
        }
    } else {
        parseError = error;
    }
    return { documentData, parseError };
}
