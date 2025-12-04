"use client";
import { ComponentProps, useState } from "react";
import { TextDocumentComment } from "@/components/blog/types";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { ReplyIcon } from "lucide-react";
import Comments from "./comments";
import { twMerge } from "tailwind-merge";
import { useI18n } from "@/locales/client";

export default function CommentReplies({
    data,
    currentUser,
    className,
}: {
    data: TextDocumentComment;
    currentUser: User;
} & ComponentProps<"div">) {
    const [showResponses, setShowResponses] = useState<boolean>(false);
    const [enableReply, setEnableReply] = useState<boolean>(false);
    const t = useI18n();
    return currentUser ? (
        <>
            <div className={twMerge("flex flex-row items-center", className)}>
                {data.responses_count && data.responses_count[0].count > 0 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-70 p-2"
                        type="button"
                        onClick={() => setShowResponses(!showResponses)}
                    >
                        {`${
                            showResponses || enableReply
                                ? t("Blog.hide")
                                : t("Blog.show")
                        } ${t("Blog.replies")}`}
                    </Button>
                )}
                {currentUser && (
                    <Button
                        size="icon"
                        variant="ghost"
                        className="p-2"
                        type="button"
                        onClick={() => {
                            setEnableReply(!enableReply);
                        }}
                    >
                        <ReplyIcon />
                    </Button>
                )}
            </div>
            {(showResponses || enableReply) && (
                <Comments
                    articleId={data.text_document_id}
                    user={currentUser}
                    replyToId={data.id}
                    showNewComment={enableReply}
                />
            )}
        </>
    ) : (
        <></>
    );
}
