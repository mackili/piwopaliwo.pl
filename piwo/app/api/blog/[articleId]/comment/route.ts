import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { TextDocumentCommentSupabaseResponse } from "@/components/blog/types";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ articleId: string }> }
) {
    const { articleId } = await params;
    const searchParams = await req.nextUrl.searchParams;
    const limit = Number(searchParams.get("limit") || 5);
    const offset = Number(searchParams.get("offset") || 0);
    const replyToId = searchParams.get("replyToId");
    const supabase = await createClient();
    const response = (await supabase
        .from("TextDocumentComment")
        .select(
            "id, author_id, text_document_id, responding_to_comment_id, time, text, responses_count:TextDocumentComment(count)",
            { count: "estimated", head: false }
        )
        .eq("text_document_id", articleId)
        .is("responding_to_comment_id", replyToId)
        .order("time", { ascending: false })
        .range(
            offset,
            offset + limit - 1
        )) as TextDocumentCommentSupabaseResponse;
    return NextResponse.json(response, {
        status: response.status,
        statusText: response.statusText,
    });
}
