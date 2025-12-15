import * as z from "zod";
export const UserNotificationSchema = z.object({
    id: z.int(),
    created_at: z.iso.datetime({ offset: true }),
    details: z.object({
        description: z.string().nullish(),
        href: z.string().nullish(),
        icon: z.string().nullish(),
    }),
    title: z.string(),
    user_id: z.uuid(),
    read_at: z.iso.datetime({ offset: true }).nullable(),
});

export type UserNotification = z.infer<typeof UserNotificationSchema>;
