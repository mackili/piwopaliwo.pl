"use client";
import ErrorMessage from "@/components/ui/error-message";
import { fetchComments } from "./fetch";
import Comment from "./comment";
import { TextDocumentComment } from "@/components/blog/types";
import { UserMetadata } from "@/components/auth/types";
import { v4 as uuid } from "uuid";
import { useEffect, useRef, useState } from "react";
import { User } from "@supabase/supabase-js";
import EditedComment from "./edited-comment";
import LoadingSpinner from "@/components/ui/loading-spinner";
import CommentsFooter from "./comments-footer";

export type CommentQueryParameters = {
    limit: number;
    offset: number;
};
const replyToCommentGenerator = (
    replyToCommentId: string | null,
    text_document_id: string,
    currentUserId: string,
    currentUserMetadata: UserMetadata
) => {
    return {
        id: uuid(),
        text_document_id: text_document_id,
        author_id: currentUserId,
        time: new Date().toISOString(),
        responding_to_comment_id: replyToCommentId,
        author: {
            firstName: currentUserMetadata.firstName,
            lastName: currentUserMetadata.lastName,
        },
        status: "draft",
    } as TextDocumentComment;
};

const upsertCommentsArray = ({
    commentsArray,
    newElements,
}: {
    commentsArray: TextDocumentComment[];
    newElements: TextDocumentComment[];
}) => {
    const idsArray = commentsArray.map((comment) => comment.id);
    newElements.forEach((newComment) => {
        const indexOfComment = idsArray.indexOf(newComment.id);
        if (indexOfComment === -1) commentsArray.push(newComment);
        else {
            commentsArray[indexOfComment] = newComment;
        }
    });
    return commentsArray;
};

const deleteCommentsFromArray = ({
    commentsArray,
    deletedElements,
}: {
    commentsArray: TextDocumentComment[];
    deletedElements: TextDocumentComment[];
}) => {
    const deletedIds = deletedElements.map((comment) => comment.id);
    return commentsArray.filter((comment) => !deletedIds.includes(comment.id));
};

export default function Comments({
    articleId,
    limit = 5,
    offset = 0,
    replyToId = null,
    user,
    showNewComment = false,
}: {
    articleId: string;
    user: User;
    limit?: number;
    offset?: number;
    replyToId?: string | null;
    showNewComment?: boolean;
}) {
    const [queryParameters, setQueryParameters] = useState({
        limit: limit,
        offset: offset,
    });
    const totalCommentCount = useRef(0);
    const [isLoading, setLoading] = useState<boolean>(true);
    const [comments, setComments] = useState<TextDocumentComment[]>([]);
    const [error, setError] = useState<string>();
    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            const { data, error, count } = await fetchComments(
                articleId,
                queryParameters.limit,
                queryParameters.offset,
                replyToId
            );
            totalCommentCount.current = count || 0;
            const comments: TextDocumentComment[] = [];
            if (showNewComment)
                comments.push(
                    replyToCommentGenerator(
                        replyToId,
                        articleId,
                        user.id,
                        user.user_metadata as UserMetadata
                    )
                );
            data?.forEach((comment) => comments.push(comment));
            if (data) setComments(comments);
            if (error) setError(`${error.code}: ${error.details}`);
            setLoading(false);
        };
        fetch();
    }, [articleId, queryParameters, replyToId, user, showNewComment]);

    const onEdit = (comment: TextDocumentComment) => {
        comment.status = "editing";
        const newArray = upsertCommentsArray({
            commentsArray: [...comments],
            newElements: [comment],
        });
        setComments(newArray);
    };
    const onCancel = (comment: TextDocumentComment) => {
        comment.status =
            comment?.status === "editing" ? "published" : undefined;
        const newArray = upsertCommentsArray({
            commentsArray: [...comments],
            newElements: [comment],
        });
        setComments(newArray);
    };
    const onSave = (comment: TextDocumentComment) => {
        comment.status = "published";
        const newArray = upsertCommentsArray({
            commentsArray: [...comments],
            newElements: [comment],
        });
        setComments(newArray);
    };
    const onDelete = (comment: TextDocumentComment) => {
        const newArray = deleteCommentsFromArray({
            commentsArray: [...comments],
            deletedElements: [comment],
        });
        setComments(newArray);
    };
    return (
        <>
            {isLoading ? (
                <LoadingSpinner />
            ) : error ? (
                <ErrorMessage error={error} />
            ) : (
                <div className="pb-4 border-b-2 border-accent">
                    {comments.map((comment) =>
                        comment?.status === "draft" ||
                        comment?.status === "editing" ? (
                            <EditedComment
                                key={comment.id}
                                data={comment}
                                currentUser={user}
                                onCancel={onCancel}
                                onSave={onSave}
                                onDelete={onDelete}
                            />
                        ) : (
                            <Comment
                                key={comment.id}
                                data={comment}
                                currentUser={user}
                                onEdit={onEdit}
                                onDelete={onDelete}
                            />
                        )
                    )}
                    <CommentsFooter
                        totalCommentCount={totalCommentCount.current}
                        parameters={queryParameters}
                        onChange={setQueryParameters}
                    />
                </div>
            )}
        </>
    );
}
