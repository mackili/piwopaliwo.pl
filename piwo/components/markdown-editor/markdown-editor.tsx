"use client";

import { useEffect, useRef, useState } from "react";
import CodeEditor from "./code-editor";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextDocument, TextDocumentSchema } from "../markdown-editor/types";
import { twMerge } from "tailwind-merge";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { useI18n } from "@/locales/client";
import { v4 as uuid } from "uuid";
import MarkdownPreview from "./markdown-preview";
import DocumentStatusSelect from "./document-status-select";
import DocumentTitle from "./document-title";
import SaveIcon, { SaveStatusEnum } from "./save-icon";
import { readTextDocument, upsertHandler } from "./db-handler";

export default function MarkdownEditor({
    textDocument,
    textDocumentId,
    className,
    ...props
}: {
    textDocument?: TextDocument;
    textDocumentId?: string;
} & React.ComponentProps<"div">) {
    const t = useI18n();
    const [previewStatus, setPreviewStatus] = useState<"visible" | "hidden">(
        "hidden"
    );
    const savedTextDocument = useRef<TextDocument | null | undefined>(
        textDocument
    );
    const [saveStatus, setSaveStatus] = useState<SaveStatusEnum>("unknown");
    const form = useForm<TextDocument>({
        resolver: zodResolver(TextDocumentSchema),
        defaultValues: {
            ...textDocument,
            title: textDocument?.title || "",
            status: textDocument?.status || "draft",
            author: textDocument?.author,
            id: textDocument?.id || textDocumentId || uuid(),
        },
    });
    // FETCHING BY ID
    useEffect(() => {
        if (!textDocument && textDocumentId) {
            const fetcher = async () => {
                const { data } = await readTextDocument({
                    documentId: textDocumentId,
                });
                if (data) {
                    // textDocument = data;
                    form.reset(data);
                }
            };
            fetcher();
        }
    });
    // AUTOSAVING
    useEffect(() => {
        const interval = setInterval(async () => {
            setSaveStatus("pending");
            const { data, error } = await upsertHandler({
                newDocument: form.getValues(),
                oldDocument: savedTextDocument.current,
            });
            if (error) {
                console.error(error);
                setSaveStatus("error");
            }
            if (data) {
                savedTextDocument.current = data;
                setSaveStatus("saved");
            } else {
                setSaveStatus("unknown");
            }
        }, 5000); // 5 seconds = 5000 milliseconds
        return () => clearInterval(interval);
    }, [form]);
    return (
        <>
            <div className="flex flex-row gap-4 items-center-safe justify-between">
                <div className="flex gap-2 flex-row items-center-safe pb-4">
                    <Switch
                        id="show-preview"
                        onCheckedChange={() =>
                            previewStatus === "hidden"
                                ? setPreviewStatus("visible")
                                : setPreviewStatus("hidden")
                        }
                    />
                    <Label htmlFor="show-preview">
                        {t("TextEditor.showPreview")}
                    </Label>
                </div>
                <SaveIcon saveStatus={saveStatus} />
            </div>
            <Form {...form}>
                <form onChange={() => setSaveStatus("unsaved")}>
                    <div className="flex gap-4 flex-col sm:flex-row py-4">
                        <DocumentTitle control={form.control} name="title" />
                        <DocumentStatusSelect
                            control={form.control}
                            name="status"
                        />
                    </div>
                    <div
                        className={twMerge(
                            "transition-all ease-in-out flex h-full w-full flex-row",
                            previewStatus === "visible" ? "gap-8" : "gap-0",
                            className
                        )}
                        {...props}
                    >
                        <div className="flex-1">
                            <FormField
                                control={form.control}
                                name="id"
                                render={({ field }) => (
                                    <input type="hidden" {...field} />
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="markdown"
                                render={({ field }) => (
                                    <FormItem className="h-full flex flex-col gap-2">
                                        <FormLabel className="my-1">
                                            Markdown
                                        </FormLabel>
                                        <FormControl>
                                            <CodeEditor
                                                {...field}
                                                value={field.value || ""}
                                                className="h-full grow"
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div
                            className={twMerge(
                                "transition-all ease-in-out origin-right flex flex-col gap-4",
                                previewStatus === "hidden"
                                    ? "scale-0 opacity-0 flex-0 w-0 h-0"
                                    : "scale-100 opacity-100 flex-1"
                            )}
                        >
                            <Label htmlFor="preview">
                                {t("TextEditor.preview")}
                            </Label>
                            <MarkdownPreview
                                id="preview"
                                markdown={form.watch("markdown")}
                                className="flex flex-col gap-3"
                            />
                        </div>
                    </div>
                </form>
            </Form>
        </>
    );
}
