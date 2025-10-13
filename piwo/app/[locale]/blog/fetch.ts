import {
    TextDocument,
    TextDocumentSchema,
} from "@/components/markdown-editor/types";
import { createClient } from "@/lib/supabase/server";
import { PostgrestError } from "@supabase/supabase-js";
import z from "zod";

export async function fetchArticles() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("TextDocument")
        .select(
            "id,title,author,status,created_at,access,authorData:UserInfo!TextDocument_author_fkey1(*)"
        )
        .eq("document_type", "blog")
        .limit(10);
    console.log(data);
    let documentData: TextDocument[] | null = null;
    let parseError: z.ZodError | PostgrestError | null = null;

    if (data) {
        const parseResult = await z
            .array(TextDocumentSchema)
            .safeParseAsync(data);
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

export async function getAuthorUser() {
    const supabase = await createClient();
    const user = await supabase.auth.getUser();
    if (user && user.data) {
        const { data } = await supabase
            .from("piwo_paliwo_member")
            .select("id")
            .eq("user_id", user.data.user?.id)
            .limit(1);
        if (data && data.length === 1) {
            return { isAuthorUser: true, user: user };
        }
    }
    return { isAuthorUser: false, user: user || null };
}
