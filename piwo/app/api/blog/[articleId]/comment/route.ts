import { NextRequest, NextResponse } from "next/server";
import { fetchComments } from "@/app/[locale]/(with-navbar)/blog/read/[article]/(comments)/fetch";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ articleId: string }> }
) {
    const { articleId } = await params;
    const searchParams = await req.nextUrl.searchParams;
    const limit = Number(searchParams.get("limit") || 5);
    const offset = Number(searchParams.get("offset") || 0);
    const replyToId = searchParams.get("replyToId");
    const response = await fetchComments(articleId, limit, offset, replyToId);
    return NextResponse.json(response, {
        status: response.status,
        statusText: response.statusText,
    });
}
