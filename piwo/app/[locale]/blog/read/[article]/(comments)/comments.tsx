"use client";
import ErrorMessage from "@/components/ui/error-message";
import { deleteComment, fetchComments } from "./fetch";
import Comment from "./comment";
import { TextDocumentComment } from "@/components/blog/types";
import { UserMetadata } from "@/components/auth/types";
import { v4 as uuid } from "uuid";
import { useEffect, useState } from "react";
import { SupabaseError } from "@/utils/supabase/types";
import { User } from "@supabase/supabase-js";

async function performFetchComments(
    articleId: string,
    limit: number = 5,
    offset: number = 0,
    replyToId: string | null = null
) {
    return await fetchComments(articleId, limit, offset, replyToId);
}
const replyToCommentGenerator = (
    replyToComment: TextDocumentComment,
    currentUserId: string,
    currentUserMetadata: UserMetadata
) => {
    return {
        id: uuid(),
        text_document_id: replyToComment.text_document_id,
        author_id: currentUserId,
        time: new Date().toISOString(),
        responding_to_comment_id: replyToComment.id,
        author: {
            firstName: currentUserMetadata.firstName,
            lastName: currentUserMetadata.lastName,
        },
        status: "draft",
    } as TextDocumentComment;
};

export default function Comments({
    articleId,
    limit = 5,
    offset = 0,
    replyToId = null,
    user,
}: {
    articleId: string;
    user: User;
    limit?: number;
    offset?: number;
    replyToId?: string | null;
}) {
    const [data, setData] = useState<TextDocumentComment[] | null>(null);
    const [error, setError] = useState<SupabaseError | null>(null);
    useEffect(() => {
        performFetchComments(articleId, limit, offset, replyToId).then(
            ({ data, error }) => {
                setData(data);
                setError(error);
            }
        );
    }, [articleId, limit, offset, replyToId]);
    const addReply = (comment: TextDocumentComment) => {
        if (data && user) {
            const replyToComment = data.find(
                (respondingTo) => respondingTo.id === comment.id
            );
            if (replyToComment) {
                const responses = replyToComment.responses || [];
                if (
                    responses.filter((response) => response?.status === "draft")
                        .length > 0
                ) {
                    return;
                }
                responses.push(
                    replyToCommentGenerator(
                        comment,
                        user.id,
                        user.user_metadata as UserMetadata
                    )
                );
                replyToComment.responses = responses;
            }
            const comments = [...data];
            setData(comments);
        }
    };
    const removeComment = (commentId: string) => {
        const comments = [...(data || [])];
        function recursiveRemove(
            list: TextDocumentComment[] | undefined,
            id: string
        ) {
            return (list || []).filter((item) => {
                if ("responses" in item) {
                    item.responses = recursiveRemove(item?.responses, id);
                }
                return item.id !== id;
            });
        }
        recursiveRemove(comments, commentId);
        setData(comments);
    };
    return data ? (
        data.map((comment) => (
            <Comment
                key={comment.id}
                data={comment}
                currentUser={user}
                onDelete={removeComment}
                onReply={addReply}
            />
        ))
    ) : error ? (
        <ErrorMessage error={`${error.code}: ${error.details}`} />
    ) : (
        <ErrorMessage error={error} />
    );
}
