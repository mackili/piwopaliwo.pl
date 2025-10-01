import * as z from "zod";

export const DocumentSectionTypeEnum = z.enum([
    "image",
    "header",
    "h1",
    "h2",
    "h3",
    "h4",
    "p",
    "code",
]);
export type DocumentSectionType = z.infer<typeof DocumentSectionTypeEnum>;

export const SpanSectionSchema = z.object({
    text: z.string(),
    className: z.string().optional(),
});
export type SpanSection = z.infer<typeof SpanSectionSchema>;

const DocumentSectionBaseSchema = z.object({
    documentId: z.uuid(),
    id: z.uuid(),
    type: DocumentSectionTypeEnum,
    order: z.number(),
    className: z.string().optional(),
    parent: z.uuid().optional(),
    children: z.array(z.uuid()),
});
export type DocumentSectionBase = z.infer<typeof DocumentSectionBaseSchema>;

export const ImageSectionSchema = DocumentSectionBaseSchema.extend({
    type: z.literal("image"),
    data: z.object({
        url: z.string(),
        fallback: z.string(),
        caption: z.array(SpanSectionSchema).optional(),
    }),
});
export type ImageSection = z.infer<typeof ImageSectionSchema>;

export const HeaderSectionSchema = DocumentSectionBaseSchema.extend({
    type: z.literal("header"),
    data: z.object({
        text: z.array(SpanSectionSchema),
    }),
});
export type HeaderSection = z.infer<typeof HeaderSectionSchema>;

export const H1SectionSchema = DocumentSectionBaseSchema.extend({
    type: z.literal("h1"),
    data: z.object({
        text: z.array(SpanSectionSchema),
    }),
});
export type H1Section = z.infer<typeof H1SectionSchema>;

export const H2SectionSchema = DocumentSectionBaseSchema.extend({
    type: z.literal("h2"),
    data: z.object({
        text: z.array(SpanSectionSchema),
    }),
});
export type H2Section = z.infer<typeof H2SectionSchema>;

export const H3SectionSchema = DocumentSectionBaseSchema.extend({
    type: z.literal("h3"),
    data: z.object({
        text: z.array(SpanSectionSchema),
    }),
});
export type H3Section = z.infer<typeof H3SectionSchema>;

export const H4SectionSchema = DocumentSectionBaseSchema.extend({
    type: z.literal("h4"),
    data: z.object({
        text: z.array(SpanSectionSchema),
    }),
});
export type H4Section = z.infer<typeof H4SectionSchema>;

export const PSectionSchema = DocumentSectionBaseSchema.extend({
    type: z.literal("p"),
    data: z.object({
        text: z.array(SpanSectionSchema),
    }),
});
export type PSection = z.infer<typeof PSectionSchema>;

export const CodeSectionSchema = DocumentSectionBaseSchema.extend({
    type: z.literal("code"),
    data: z.object({
        text: z.array(SpanSectionSchema),
    }),
});
export type CodeSection = z.infer<typeof CodeSectionSchema>;

export const TextDocumentSectionSchema = z.discriminatedUnion("type", [
    ImageSectionSchema,
    HeaderSectionSchema,
    H1SectionSchema,
    H2SectionSchema,
    H3SectionSchema,
    H4SectionSchema,
    PSectionSchema,
    CodeSectionSchema,
]);
export type TextDocumentSection = z.infer<typeof TextDocumentSectionSchema>;

export const TextDocumentSchema = z.object({
    id: z.uuidv4(),
    title: z.string().nullish(),
    author: z.uuidv4(),
    status: z.enum(["draft", "published", "unpublished"]),
    created_at: z.iso.datetime({ offset: true }).optional(),
    sections: z.array(TextDocumentSectionSchema).optional(),
    access: z.enum(["open", "restricted"]),
});
export type TextDocument = z.infer<typeof TextDocumentSchema>;
