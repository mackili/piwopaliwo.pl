"use client";
import { useFieldArray, useForm } from "react-hook-form";
import {
    DocumentSectionType,
    TextDocument,
    TextDocumentSchema,
    TextDocumentSection,
} from "./types";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 } from "uuid";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState, useCallback, useRef } from "react";
import { User } from "@supabase/supabase-js";
import { ClassNameValue, twMerge } from "tailwind-merge";
import { readTextDocument, upsertHandler } from "./db-read-handler";
import { useI18n } from "@/locales/client";
import DocumentSection from "./document-section";
import NewSection, { defaultSection } from "./new-section";
import SaveIcon, { SaveStatusEnum } from "./saving-icon";
import StatusDropdown from "./document-status";

const supabase = createClient();
const sectionInputCss: ClassNameValue = [
    "hover:bg-primary/10",
    "transition-all",
    "ease-in-out",
    "duration-300",
];

export default function WYSIWYG({
    documentId,
}: {
    documentId?: string | undefined | null;
}) {
    const t = useI18n();
    const [saveStatus, setSaveStatus] = useState<SaveStatusEnum>("unknown");
    const [user, setUser] = useState<User | undefined | null>();
    const [documentDB, setDocumentDB] = useState<
        TextDocument | undefined | null
    >();
    const lastSavedDocumentRef = useRef<TextDocument | undefined | null>(null);
    const getUserInfo = useCallback(async function () {
        setUser((await supabase.auth.getUser()).data.user);
    }, []);
    const getTextDocument = useCallback(
        async function () {
            if (documentId) {
                const readResult = await readTextDocument({
                    documentId: documentId,
                });
                if (readResult.data) {
                    setDocumentDB(readResult?.data);
                    lastSavedDocumentRef.current = structuredClone(
                        readResult.data
                    );
                    setSaveStatus("saved");
                }
                if (readResult.error) {
                    setSaveStatus("error");
                }
            }
        },
        [documentId]
    );
    useEffect(() => {
        if (!user) {
            getUserInfo();
        }
        if (!documentDB && documentId) {
            getTextDocument();
        }
    }, [user, documentDB, documentId, getUserInfo, getTextDocument]);
    const form = useForm<TextDocument>({
        resolver: zodResolver(TextDocumentSchema),
        defaultValues: {
            id: documentDB?.id || v4(),
            title: documentDB?.title || "",
            author: documentDB?.author || user?.id || "",
            sections: documentDB?.sections || [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "sections",
    });
    useEffect(() => {
        if (documentDB) {
            form.reset(documentDB);
            form.setValue("author", documentDB.author);
        }
        if (user?.id) {
            form.setValue("author", user.id);
        }
        if (form) {
        }
    }, [user, form, documentDB]);

    // AUTOSAVE
    useEffect(() => {
        const interval = setInterval(async () => {
            setSaveStatus("pending");
            const res = await upsertHandler({
                newDocument: form.getValues(),
                oldDocument: lastSavedDocumentRef.current,
            });
            if (res?.data) {
                lastSavedDocumentRef.current = structuredClone(
                    res.data as TextDocument
                );
                setSaveStatus("saved");
            }
            if (res?.error) {
                setSaveStatus("error");
            }
        }, 100000); // 10 seconds

        return () => clearInterval(interval);
    }, [form]);
    console.log(fields.sort((a, b) => a.order - b.order));
    return (
        <form
            className="grid grid-cols-1 gap-2"
            onChange={() =>
                saveStatus !== "unsaved" && setSaveStatus("unsaved")
            }
        >
            <input {...form.register("id")} type="hidden"></input>
            <div className="flex justify-stretch">
                <header className="grow">
                    <input
                        className={twMerge(sectionInputCss)}
                        {...form.register("title")}
                        type="text"
                        placeholder={t("TextEditor.title")}
                    ></input>
                </header>
                <div className="flex gap-2 justify-center items-center-safe flex-col-reverse md:flex-row">
                    <StatusDropdown
                        control={form.control}
                        onStatusChange={() => setSaveStatus("unsaved")}
                    />
                    <SaveIcon saveStatus={saveStatus} />
                </div>
            </div>
            <NewSection
                onAddSection={(type) =>
                    append(
                        defaultSection(
                            form.getValues("id"),
                            undefined,
                            type as DocumentSectionType
                        )
                    )
                }
            />
            {fields
                .sort((a, b) => a.order - b.order)
                .map((section, index) => (
                    <DocumentSection
                        key={`${section.id}-${section.type}`}
                        control={form.control}
                        name={`sections.${section.order}`}
                        section={section as TextDocumentSection}
                        setValue={form.setValue}
                        getValues={form.getValues}
                        onNewSection={(type) =>
                            append(
                                defaultSection(
                                    form.getValues("id"),
                                    section.order + 5,
                                    type as DocumentSectionType
                                )
                            )
                        }
                        onRemove={() => remove(index)}
                    />
                ))}
        </form>
    );
}
