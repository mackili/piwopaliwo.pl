import * as z from "zod";

const passwordSchema = z
    .string()
    .min(8)
    .max(24)
    .refine((password) => /[A-Z]/.test(password))
    .refine((password) => /[a-z]/.test(password))
    .refine((password) => /[0-9]/.test(password))
    .refine((password) => /[!@#$%^&*]/.test(password));

export const UserSchema = z.object({
    username: z.string().min(5).optional(),
    email: z.email(),
    firstName: z.string().min(2).optional(),
    lastName: z.string().min(2).optional(),
    password: passwordSchema,
});

export type User = z.infer<typeof UserSchema>;
