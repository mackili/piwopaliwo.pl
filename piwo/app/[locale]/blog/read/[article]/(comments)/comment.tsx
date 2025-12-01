"use client";
import { TextDocumentComment } from "@/components/blog/types";
import { Button } from "@/components/ui/button";
import { ComponentProps, useState } from "react";
import { twMerge } from "tailwind-merge";
// import CommentsDisplay from "./comments-display";
import { User, UserResponse } from "@supabase/supabase-js";
import { EditIcon, ReplyIcon, X } from "lucide-react";
import EditComment from "./edit-comment";
import { v4 as uuid } from "uuid";
import { UserMetadata } from "@/components/auth/types";
import DeleteComment from "./delete-comment";
import { UserAvatar } from "@/components/user-avatar";
import { CurrentUserAvatar } from "@/components/current-user-avatar";
import Comments from "./comments";

// const replyToCommentGenerator = (
//     replyToComment: TextDocumentComment,
//     currentUserId: string,
//     currentUserMetadata: UserMetadata
// ) => {
//     return {
//         id: uuid(),
//         text_document_id: replyToComment.text_document_id,
//         author_id: currentUserId,
//         time: new Date().toISOString(),
//         responding_to_comment_id: replyToComment.id,
//         author: {
//             firstName: currentUserMetadata.firstName,
//             lastName: currentUserMetadata.lastName,
//         },
//     } as TextDocumentComment;
// };

export default function Comment({
    data,
    currentUser,
    isEdit = false,
    onSave,
    onDelete,
    onReply,
    className,
}: {
    data: TextDocumentComment;
    isEdit?: boolean;
    onSave?: () => void;
    onDelete: (commentId: string) => void;
    onReply?: (comment: TextDocumentComment) => void;
    currentUser: User;
} & ComponentProps<"div">) {
    const currentUserId = currentUser.id;
    // const currentUserMetadata = currentUser.user_metadata as UserMetadata;
    const [comment, setComment] = useState<TextDocumentComment>(data);
    const [editStatus, setEditStatus] = useState<"noedit" | "edit" | "saving">(
        isEdit ? "edit" : "noedit"
    );
    const [showReplies, setShowReplies] = useState<boolean>(false);
    // const [enableReply, setEnableReply] = useState<boolean>(false);
    return (
        <div
            className={twMerge(
                "flex flex-row flex-nowrap gap-4 my-4 w-full",
                className
            )}
        >
            {data.author_id === currentUserId ? (
                <CurrentUserAvatar user={currentUser} className="w-16 h-16" />
            ) : (
                <UserAvatar
                    avatarUrl={data.author?.avatarUrl}
                    name={`${data.author?.firstName} ${data.author?.lastName}`}
                    className="w-16 h-16"
                />
            )}
            <div className="w-full">
                <div className="min-h-16">
                    <div className="flex flex-row gap-4 items-center min-h-9">
                        <p className="font-bold">{`${data.author?.firstName} ${data.author?.lastName}`}</p>
                        <p className="opacity-80 text-sm">{`${new Date(
                            comment.time
                        ).toLocaleDateString()} ${new Date(
                            comment.time
                        ).toLocaleTimeString()}`}</p>
                        {data.author_id === currentUserId && (
                            <div className="flex flex-row flex-nowrap">
                                {editStatus === "noedit" && (
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => setEditStatus("edit")}
                                    >
                                        <EditIcon />
                                    </Button>
                                )}
                                <DeleteComment
                                    data={comment}
                                    currentUser={currentUser}
                                    onDelete={onDelete}
                                />
                            </div>
                        )}
                    </div>
                    <div className="flex gap-4 flex-col">
                        {editStatus === "noedit"
                            ? comment.text
                            : currentUserId === data.author_id && (
                                  <EditComment
                                      comment={comment}
                                      currentUserId={data.author_id}
                                      textDocumentId={data.text_document_id}
                                      onsave={
                                          onSave
                                              ? onSave
                                              : (comment) => {
                                                    setComment(comment);
                                                    setEditStatus("noedit");
                                                }
                                      }
                                  />
                              )}
                    </div>
                </div>
                <div className="flex flex-row items-center">
                    {data.responses_count &&
                        data.responses_count[0].count > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="opacity-70 p-2"
                                type="button"
                                onClick={() => setShowReplies(!showReplies)}
                            >
                                {`${
                                    showReplies === true ? "Hide" : "Show"
                                } Responses`}
                            </Button>
                        )}
                    {editStatus === "noedit" && currentUser && (
                        <Button
                            size="icon"
                            variant="ghost"
                            className="p-2"
                            type="button"
                            onClick={() => {
                                if (onReply) onReply(data);
                            }}
                        >
                            <ReplyIcon />
                        </Button>
                    )}
                </div>
                {data?.responses
                    ?.filter((response) => response?.status === "draft")
                    .map((response) => (
                        <Comment
                            key={response.id}
                            data={response}
                            isEdit={true}
                            currentUser={currentUser}
                            onDelete={onDelete}
                        />
                    ))}
                {showReplies && (
                    <Comments
                        articleId={data.text_document_id}
                        user={currentUser}
                        replyToId={data.id}
                    />
                )}
            </div>
        </div>
    );
}
