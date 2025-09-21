import * as z from "zod";

export const SupabaseErrorSchema = z.object({
    code: z.string(),
    details: z.string().nullable(),
    hint: z.string().nullable(),
    message: z.string().nullable(),
});

export type SupabaseError = z.infer<typeof SupabaseErrorSchema>;

export function SupabaseResponseSchema<T extends z.ZodTypeAny>(itemSchema: T) {
    return z.object({
        error: SupabaseErrorSchema.nullable(),
        data: z.array(itemSchema).nullable(),
        count: z.number().nullable().optional(),
        status: z.number(),
        statusText: z.string(),
    });
}

export type SupabaseResponse<T = unknown> = {
    error: SupabaseError | null;
    data: T[] | null;
    count: number | null;
    status: number;
    statusText: string;
};
