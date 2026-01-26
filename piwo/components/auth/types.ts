import * as z from "zod";

export const passwordRequirements = [
    { pattern: /[A-Z]/, message: "PasswordRequirements.capitalLetter" },
    { pattern: /[a-z]/, message: "PasswordRequirements.smallLetter" },
    { pattern: /[0-9]/, message: "PasswordRequirements.number" },
    { pattern: /[!@#$%^&*]/, message: "PasswordRequirements.specialChar" },
    { pattern: /\S{8,24}/, message: "PasswordRequirements.length" },
];

export const passwordSchema = z
    .string(
        "Password must be 8-24 characters long and contain at least one small letter, at least one capital letter, a number and a special character",
    )
    .min(8)
    .max(24)
    .refine((password) =>
        passwordRequirements.every((req) => req.pattern.test(password)),
    );

export const UserMetadataSchema = z.object({
    username: z.string().min(5).optional(),
    email: z.email(),
    firstName: z.string().min(2).optional(),
    lastName: z.string().min(2).optional(),
});

export const UserInfoSchema = z.object({
    userId: z.uuidv4(),
    firstName: z.string().min(2).optional(),
    lastName: z.string().min(2).optional(),
});

export const UserSchema = UserMetadataSchema.safeExtend({
    password: passwordSchema,
});

export type UserMetadata = z.infer<typeof UserMetadataSchema>;
export type UserInfo = z.infer<typeof UserInfoSchema>;
export type User = z.infer<typeof UserSchema>;

export type GoogleCredentialResponse = {
    credential: string;
    select_by: string;
    state: string;
};
