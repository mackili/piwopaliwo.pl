"use client";
import {
    TextDocumentComment,
    TextDocumentCommentSupabaseResponse,
} from "@/components/blog/types";
import ErrorMessage from "@/components/ui/error-message";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useEffect, useState } from "react";

export default function CommentSection({ articleId }: { articleId: string }) {
    const [status, setStatus] = useState<"pending" | "ok" | "error">("pending");
    const [error, setError] = useState<null | string>(null);
    const [limit, setLimit] = useState(5);
    const [offset, setOffset] = useState(0);
    const [comments, setComments] = useState<null | TextDocumentComment[]>();
    const [commentCount, setCommentCount] = useState<null | number>(null);
    useEffect(() => {}, [status]);
    useEffect(() => {
        const fetchComments = async () => {
            setStatus("pending");
            const response = await fetch(
                `/api/blog/${articleId}/comment?limit=${limit}&offset=${offset}`
            );
            const { data, error, count } =
                (await response.json()) as TextDocumentCommentSupabaseResponse;
            if (!response.ok) {
                setError(`${error?.code}: ${error?.details}`);
                setStatus("error");
                return;
            }
            setCommentCount(count);
            setComments(data);
            setStatus("ok");
        };
        fetchComments();
    }, [articleId, limit, offset]);
    return (
        <div>
            <h2>Comments</h2>
            {status === "pending" ? (
                <LoadingSpinner />
            ) : status === "error" ? (
                <ErrorMessage error={error} />
            ) : (
                <>
                    {comments?.map((comment) => (
                        <div key={comment.id}>{JSON.stringify(comment)}</div>
                    ))}
                    <h6>
                        Displaying {offset + 1}-
                        {Math.min(offset + limit, commentCount || 0)} comments
                        out of {commentCount}
                    </h6>
                </>
            )}
        </div>
    );
}
