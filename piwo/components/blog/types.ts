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
        return z.array(TextDocumentCommentSchema).optional();
    },
    responses_count: z.array(z.object({ count: z.int() })).nullish(),
    author: z
        .object({
            firstName: z.string().nullable(),
            lastName: z.string().nullable(),
            avatarUrl: z.url().nullable(),
        })
        .optional(),
    status: z.enum(["draft", "published", "editing"]).nullish(),
});

export type TextDocumentComment = z.infer<typeof TextDocumentCommentSchema>;

export type TextDocumentCommentSupabaseResponse =
    SupabaseResponse<TextDocumentComment>;
export type TextDocumentCommentSupabaseSingleResponse =
    SupabaseResponse<TextDocumentComment> & {
        data: TextDocumentComment;
    };
