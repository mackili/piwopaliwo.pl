"use server";
import { createClient } from "@/lib/supabase/server";
import {
    TextDocumentComment,
    TextDocumentCommentSchema,
    TextDocumentCommentSupabaseResponse,
    TextDocumentCommentSupabaseSingleResponse,
} from "@/components/blog/types";

export async function fetchComments(
    articleId: string,
    limit: number = 5,
    offset: number = 0,
    replyToId: string | null = null
) {
    const supabase = await createClient();
    const response = (await supabase
        .from("TextDocumentComment")
        .select(
            "id, author_id, text_document_id, responding_to_comment_id, time, text, responses_count:TextDocumentComment(count), author:UserInfo(firstName, lastName, avatarUrl)",
            { count: "estimated", head: false }
        )
        .eq("text_document_id", articleId)
        .filter("responding_to_comment_id", replyToId ? "eq" : "is", replyToId)
        .order("time", { ascending: false })
        .range(
            offset,
            offset + limit - 1
        )) as TextDocumentCommentSupabaseResponse;
    return response;
}

export async function saveComment(comment: TextDocumentComment) {
    comment.time = comment?.time || new Date().toISOString();
    const { data, error } = await TextDocumentCommentSchema.safeParseAsync(
        comment
    );
    if (error) {
        return { data: null, error: error.message };
    }
    const supabase = await createClient();
    const response = (await supabase
        .from("TextDocumentComment")
        .upsert(data)
        .select()
        .single()) as TextDocumentCommentSupabaseSingleResponse;
    return response;
}

export async function deleteComment(commentId: string) {
    const supabase = await createClient();
    const response = await supabase
        .from("TextDocumentComment")
        .delete()
        .eq("id", commentId)
        .select();
    return response;
}
