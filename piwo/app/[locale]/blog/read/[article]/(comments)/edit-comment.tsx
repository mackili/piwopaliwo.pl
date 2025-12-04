"use client";
import {
    TextDocumentComment,
    TextDocumentCommentSchema,
} from "@/components/blog/types";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState } from "react";
import { useForm } from "react-hook-form";
import { saveComment } from "./fetch";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { v4 as uuid } from "uuid";
import ErrorMessage from "@/components/ui/error-message";
import { useI18n } from "@/locales/client";

export default function EditComment({
    comment,
    currentUserId,
    textDocumentId,
    respondingToId = null,
    onSave,
}: {
    comment?: TextDocumentComment | undefined;
    currentUserId: string;
    textDocumentId: string;
    respondingToId?: string | null;
    onSave?: (comment: TextDocumentComment) => void;
}) {
    const t = useI18n();
    async function performSave() {
        const author = comment?.author;
        const { data, error } = await saveComment(form.getValues());
        if (error || !data) {
            form.setError("text", {
                message:
                    typeof error === "string"
                        ? JSON.parse(error)[0]?.message
                        : error?.details || "",
            });
            return "error";
        }
        data.author = author;
        if (onSave) onSave(data);
        return "success";
    }
    const [saveStatus, saveCommentAction, isPending] = useActionState<
        "error" | "success" | null
    >(performSave, null);
    const form = useForm<TextDocumentComment>({
        resolver: zodResolver(TextDocumentCommentSchema),
        defaultValues: {
            id: comment?.id || uuid(),
            author_id: comment?.author_id || currentUserId,
            text: comment?.text || "",
            text_document_id: comment?.text_document_id || textDocumentId,
            responding_to_comment_id:
                comment?.responding_to_comment_id || respondingToId,
        },
    });
    return (
        <Form {...form}>
            <form action={saveCommentAction} className="flex flex-col gap-4">
                <FormField
                    control={form.control}
                    name="text"
                    render={({ field, fieldState }) => (
                        <FormItem>
                            <FormControl>
                                <Textarea
                                    {...field}
                                    value={field.value || ""}
                                    aria-invalid={fieldState.invalid}
                                />
                            </FormControl>
                            {fieldState.invalid && (
                                <ErrorMessage
                                    error={fieldState?.error?.message || ""}
                                />
                            )}
                        </FormItem>
                    )}
                />
                <Button
                    type="submit"
                    variant={saveStatus === "error" ? "destructive" : "default"}
                >
                    {isPending ? <LoadingSpinner /> : t("Blog.save")}
                </Button>
            </form>
        </Form>
    );
}
