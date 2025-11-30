import { SupabaseResponse } from "@/utils/supabase/types";
import * as z from "zod";

export const TextDocumentCommentSchema = z.object({
    id: z.uuidv4(),
    text_document_id: z.uuidv4(),
    author_id: z.uuidv4(),
    responding_to_comment_id: z.uuidv4().nullable(),
    time: z.iso.datetime({ offset: true }),
    text: z.string().nullish(),
    get responses() {
        return z.array(TextDocumentCommentSchema);
    },
    responses_count: z.array(z.object({ count: z.int() })).nullish(),
});

export type TextDocumentComment = z.infer<typeof TextDocumentCommentSchema>;

export type TextDocumentCommentSupabaseResponse =
    SupabaseResponse<TextDocumentComment>;
