import { TextDocumentComment } from "@/components/blog/types";
import { Button } from "@/components/ui/button";
import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";
import { User } from "@supabase/supabase-js";
import { X } from "lucide-react";
import { UserAvatar } from "@/components/user-avatar";
import { CurrentUserAvatar } from "@/components/current-user-avatar";
import EditComment from "./edit-comment";
import DeleteComment from "./delete-comment";
import { useCurrentLocale } from "@/locales/client";

export default function EditedComment({
    data,
    currentUser,
    onCancel,
    onSave,
    onDelete,
    className,
}: {
    data: TextDocumentComment;
    onCancel?: (comment: TextDocumentComment) => void;
    onSave?: (comment: TextDocumentComment) => void;
    onDelete?: (comment: TextDocumentComment) => void;
    currentUser: User;
} & ComponentProps<"div">) {
    const currentUserId = currentUser.id;
    const locale = useCurrentLocale();
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
                            data.time
                        ).toLocaleDateString(locale)} ${new Date(
                            data.time
                        ).toLocaleTimeString(locale)}`}</p>
                        {data.author_id === currentUserId && (
                            <div className="flex flex-row flex-nowrap">
                                {data?.status !== "draft" && (
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() =>
                                            onCancel && onCancel(data)
                                        }
                                    >
                                        <X />
                                    </Button>
                                )}
                                <DeleteComment
                                    data={data}
                                    currentUser={currentUser}
                                    onDelete={onDelete}
                                />
                            </div>
                        )}
                    </div>
                    <div className="flex gap-4 flex-col">
                        <EditComment
                            comment={data}
                            currentUserId={currentUserId}
                            textDocumentId={data.text_document_id}
                            respondingToId={data.responding_to_comment_id}
                            onSave={onSave}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
