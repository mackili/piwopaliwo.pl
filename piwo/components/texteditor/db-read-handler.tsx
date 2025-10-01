"use client";
import { createClient } from "@/utils/supabase/client";
import {
    TextDocument,
    TextDocumentSchema,
    TextDocumentSection,
    TextDocumentSectionSchema,
} from "./types";

const supabase = createClient();

export async function readTextDocument({ documentId }: { documentId: string }) {
    const { data, error } = await supabase
        .from("TextDocument")
        .select("*, TextDocumentSection(*)")
        .filter("id", "eq", documentId)
        .limit(1)
        .single();

    if (error) {
        return { data: null, error };
    }
    try {
        const parseResult = await TextDocumentSchema.safeParseAsync(data);
        if (parseResult.success) {
            return { data: parseResult.data, error: null };
        } else {
            return { data: null, error: parseResult.error };
        }
    } catch (err) {
        return { data: null, error: err };
    }
}

export async function upsertTextDocument({
    document,
}: {
    document: TextDocument;
}) {
    const { sections, ...doc } = document;
    const res = await supabase.from("TextDocument").upsert(doc).select();
    const parseResult = await TextDocumentSchema.safeParseAsync(res.data);

    if (!parseResult.success) {
        return { data: null, error: parseResult.error, sectionsError: null };
    }

    const sectionsResult = await upsertTextDocumentSections({
        sections: sections || [],
    });

    return {
        data: {
            ...parseResult.data,
            sections: sectionsResult.data ?? undefined,
        },
        error: null,
        sectionsError: sectionsResult.error ?? null,
    };
}

export async function upsertTextDocumentSections({
    sections,
}: {
    sections: TextDocumentSection[];
}) {
    const { data, error } = await supabase
        .from("TextDocumentSection")
        .upsert(sections)
        .select();

    if (error) {
        return { data: null, error };
    }
    const parseResult = await TextDocumentSectionSchema.safeParseAsync(data);
    if (parseResult.success) {
        return { data: parseResult.data, error: null };
    } else {
        return { data: null, error: parseResult.error };
    }
}
