import { TextDocumentComment } from "@/components/blog/types";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";
import { Trash2Icon } from "lucide-react";
import { deleteComment } from "./fetch";
import { useState } from "react";
import LoadingSpinner from "@/components/ui/loading-spinner";

export default function DeleteComment({
    data,
    currentUser,
    onDelete,
}: {
    data: TextDocumentComment;
    currentUser: User;
    onDelete?: (comment: TextDocumentComment) => void;
}) {
    const [deleteStatus, setDeleteStatus] = useState<
        "error" | "pending" | null
    >(null);
    async function handleDelete() {
        setDeleteStatus("pending");
        if (data?.status !== "draft") {
            const res = await deleteComment(data.id);
            if (res.error) {
                console.error(res.error);
                setDeleteStatus("error");
                return;
            }
        }
        if (onDelete) {
            onDelete(data);
        }
    }
    return (
        data.author_id === currentUser.id && (
            <Button
                size="icon"
                variant={deleteStatus === "error" ? "destructive" : "ghost"}
                type="button"
                onClick={handleDelete}
            >
                {deleteStatus === "pending" ? (
                    <LoadingSpinner />
                ) : (
                    <Trash2Icon />
                )}
            </Button>
        )
    );
}
