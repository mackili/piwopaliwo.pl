"use client";
import { useFieldArray, useForm } from "react-hook-form";
import { TextDocument, TextDocumentSchema, TextDocumentSection } from "./types";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 } from "uuid";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState, useCallback } from "react";
import { User } from "@supabase/supabase-js";
import { ClassNameValue, twMerge } from "tailwind-merge";
import { readTextDocument } from "./db-read-handler";
import { useI18n } from "@/locales/client";
import DocumentSection from "./document-section";
import NewSection, { defaultSection } from "./new-section";

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
    const [user, setUser] = useState<User | undefined | null>();
    const [documentDB, setDocumentDB] = useState<
        TextDocument | undefined | null
    >();
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

    const { fields, append } = useFieldArray({
        control: form.control,
        name: "sections",
    });
    useEffect(() => {
        if (documentDB) {
            form.setValue("author", documentDB.author);
        }
        if (user?.id) {
            form.setValue("author", user.id);
        }
    }, [user, form, documentDB]);
    return (
        <form
            className="grid grid-cols-1 gap-2"
            onChange={() => console.log(form.getValues())}
        >
            <input {...form.register("id")} type="hidden"></input>
            <div>
                <header>
                    <input
                        className={twMerge(sectionInputCss)}
                        {...form.register("title")}
                        type="text"
                        placeholder={t("TextEditor.title")}
                    ></input>
                </header>
            </div>
            <NewSection
                onAddSection={() =>
                    append(defaultSection(form.getValues("id")))
                }
            />
            {fields.map((section, index) => (
                <DocumentSection
                    key={section.id}
                    control={form.control}
                    name={`sections.${index}`}
                    section={section as TextDocumentSection}
                />
            ))}
        </form>
    );
}
