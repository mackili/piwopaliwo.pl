"use client";
import { createClient } from "@/utils/supabase/client";
import {
    TextDocument,
    TextDocumentSchema,
    TextDocumentSection,
    TextDocumentSectionSchema,
} from "./types";
import isEqual from "lodash.isequal";
import { error } from "console";

const supabase = createClient();
const TEXT_DOCUMENT_SELECT = "*";
const SECTIONS_SELECT = "sections:TextDocumentSection(*)";

export async function readTextDocument({ documentId }: { documentId: string }) {
    const { data, error } = await supabase
        .from("TextDocument")
        .select(`${TEXT_DOCUMENT_SELECT}, ${SECTIONS_SELECT}`)
        .filter("id", "eq", documentId)
        .limit(1)
        .single();
    if (error) {
        console.error(error);
        return { data: null, error };
    }
    try {
        // Map parent to children sections
        // data.sections =
        //     (data.sections as TextDocumentSection[]).map((section) => ({
        //         ...section,
        //         children: (data.sections as TextDocumentSection[])
        //             .filter(
        //                 (filterSection) => filterSection?.parent === section.id
        //             )
        //             ?.map((filtered) => filtered.id),
        //     })) || [];
        data.sections = await mapChildrenToParentSections(data?.sections || []);
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

export async function mapChildrenToParentSections(
    sections: TextDocumentSection[]
) {
    return (
        sections.map((section) => ({
            ...section,
            children:
                sections
                    .filter(
                        (filterSection) => filterSection?.parent === section.id
                    )
                    ?.map((filtered) => filtered.id) || [],
        })) || []
    );
}

export async function upsertTextDocument({
    document,
}: {
    document: TextDocument;
}) {
    const { sections, ...doc } = document;
    const res = await supabase
        .from("TextDocument")
        .upsert(doc)
        .select(TEXT_DOCUMENT_SELECT)
        .limit(1)
        .single();
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
            sections: sectionsResult.data ?? [],
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
    if (sections.length === 0) {
        return { data: null, error: null };
    }
    const sanitizedSections = sections.map(({ children, ...rest }) => rest);
    const { data, error } = await supabase
        .from("TextDocumentSection")
        .upsert(sanitizedSections)
        .select();
    return { data: data, error: error };
}

export async function deleteTextDocumentSections(uuids?: string[]) {
    if (!uuids || uuids.length === 0) return;
    const { data, error } = await supabase
        .from("TextDocumentSection")
        .delete()
        .in("id", uuids);
    if (error) {
        return { data: null, error };
    }
    return { data: data, error: null };
}

export function diffTextDocumentSections({
    oldSections,
    newSections,
}: {
    oldSections?: TextDocumentSection[];
    newSections?: TextDocumentSection[];
}) {
    if (!oldSections) {
        return {
            sectionsToDelete: [],
            sectionsToUpsert: newSections || [],
            unchangedSections: [],
        };
    }
    if (!newSections) {
        return {
            sectionsToDelete: oldSections.map((section) => section.id),
            sectionsToUpsert: [],
            unchangedSections: [],
        };
    }
    const sectionsToDelete = oldSections
        .filter(
            (oldSection) =>
                !newSections.some(
                    (newSection) => newSection.id === oldSection.id
                )
        )
        .map((section) => section.id);
    const sectionsToUpsert = newSections.filter((newSection) => {
        const oldSection = oldSections.find((s) => s.id === newSection.id);
        return !oldSection || !isEqual(oldSection, newSection);
    });

    const unchangedSections = newSections.filter((newSection) => {
        const oldSection = oldSections.find((s) => s.id === newSection.id);
        return oldSection && isEqual(oldSection, newSection);
    });

    return { sectionsToDelete, sectionsToUpsert, unchangedSections };
}

function compareDocumentMetadata({
    newDocument,
    oldDocument,
}: {
    newDocument: TextDocument;
    oldDocument?: TextDocument | null;
}) {
    return (
        newDocument?.status === oldDocument?.status &&
        newDocument?.access === oldDocument?.access &&
        newDocument?.title === oldDocument?.title
    );
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
    const { sectionsToDelete, sectionsToUpsert, unchangedSections } =
        diffTextDocumentSections({
            oldSections: oldDocument?.sections,
            newSections: newDocument?.sections,
        });
    if (
        compareDocumentMetadata({ newDocument, oldDocument }) &&
        sectionsToDelete.length === 0 &&
        sectionsToUpsert.length === 0
    ) {
        return { data: newDocument, error: null };
    }
    await deleteTextDocumentSections(sectionsToDelete);
    const res = await upsertTextDocument({
        document: {
            ...newDocument,
            sections: sectionsToUpsert,
        },
    });
    if (res.data) {
        res.data.sections = await mapChildrenToParentSections([
            ...unchangedSections,
            ...sectionsToUpsert,
        ]);
    }
    return res;
}
