"use client";
import { createClient } from "@/utils/supabase/client";
import { TextDocument, TextDocumentSchema } from "../markdown-editor/types";
import isEqual from "lodash.isequal";
import { PostgrestError } from "@supabase/supabase-js";
import { ZodError } from "zod";

const supabase = createClient();
const TEXT_DOCUMENT_SELECT = "*";

async function parseDocumentResult({
    data,
    error,
}: {
    data: TextDocument;
    error: PostgrestError | ZodError | null;
}) {
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

export async function readTextDocument({ documentId }: { documentId: string }) {
    const { data, error } = await supabase
        .from("TextDocument")
        .select(TEXT_DOCUMENT_SELECT)
        .filter("id", "eq", documentId)
        .limit(1)
        .single();
    return await parseDocumentResult({ data, error });
}

async function compareDocumentVersions({
    newDocument,
    oldDocument,
}: {
    newDocument: TextDocument;
    oldDocument?: TextDocument | null;
}) {
    return isEqual({ ...newDocument }, { ...oldDocument });
}

async function upsertTextDocument({ document }: { document: TextDocument }) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { authorData, ...documentWithoutAuthorData } = document;
    const { data, error } = await supabase
        .from("TextDocument")
        .upsert({ ...documentWithoutAuthorData })
        .select()
        .limit(1)
        .single();
    return await parseDocumentResult({ data, error });
}

export async function upsertHandler({
    newDocument,
    oldDocument,
}: {
    newDocument: TextDocument;
    oldDocument?: TextDocument | null;
}) {
    if (!oldDocument) {
        return await upsertTextDocument({ document: newDocument });
    }
    if (
        (await compareDocumentVersions({ newDocument, oldDocument })) === true
    ) {
        return { data: newDocument, error: null };
    }
    return await upsertTextDocument({ document: newDocument });
}
