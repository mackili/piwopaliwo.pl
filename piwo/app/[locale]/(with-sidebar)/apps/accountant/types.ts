import * as z from "zod";
import { UserInfoSchema } from "@/components/scoretracker/types";

export const GroupMemberStatusSchema = z.enum([
    "invited",
    "accepted",
    "rejected",
    "owner",
]);

export const GroupMemberSchema = z.object({
    id: z.uuid(),
    nickname: z.string().min(1).max(15),
    added_at: z.iso.datetime({ offset: true }).optional(),
    user_id: z.uuid().nullable(),
    group_id: z.uuid(),
    assigned_at: z.iso.datetime({ offset: true }).nullish(),
    removed_at: z.iso.datetime({ offset: true }).nullish(),
    user: UserInfoSchema.nullish(),
    status: GroupMemberStatusSchema.nullish(),
});

export const GroupCurrencySchema = z.object({
    iso: z.string().length(3),
    primary: z.boolean(),
    rate: z.number(),
});

export const GroupSchema = z.object({
    id: z.uuid(),
    name: z.string().max(100).min(2),
    created_at: z.iso.datetime({ offset: true }).optional(),
    archived_at: z.iso.datetime({ offset: true }).nullish(),
    description: z.string().nullish(),
    thumbnail_url: z.url().nullable(),
    owner_id: z.uuid(),
    owner: UserInfoSchema.optional(),
    members: z.array(GroupMemberSchema).optional(),
    currencies: z.array(GroupCurrencySchema).default([]),
});

export const TransactionSchema = z.object({
    id: z.uuid(),
    created_at: z.iso.datetime({ offset: true }).optional(),
    paid_by_id: z.uuid(),
    description: z.string().min(2),
    currency_iso_code: z.string().length(3),
    amount: z.number().nonnegative(),
    group_id: z.uuid(),
    paid_by: GroupMemberSchema.nullish(),
});

export const TransactionSplitSchema = z.object({
    group_id: z.uuid(),
    borrower_id: z.uuid(),
    transaction_id: z.uuid(),
    created_at: z.iso.datetime({ offset: true }).optional(),
    amount: z.number().min(0),
});

export const BalanceSchema = z.object({
    borrower_id: z.uuid(),
    lender_id: z.uuid(),
    created_at: z.iso.datetime({ offset: true }).optional(),
    currency_balance: z.record(z.string(), z.number().min(0)),
});
export const GroupBalanceSchema = z.object({
    borrower_id: z.uuid(),
    lender_id: z.uuid(),
    group_id: z.uuid(),
    created_at: z.iso.datetime({ offset: true }).optional(),
    currency_balance: z.record(z.string(), z.number().min(0)),
    borrower: GroupMemberSchema,
    lender: GroupMemberSchema,
});
export const TotalSpentObjectSchema = z.object({
    iso: z.string().length(3),
    amount: z.number().nonnegative(),
});
export const TransactionWithSplitsSchema = TransactionSchema.extend({
    splits: z.array(TransactionSplitSchema),
});
export const GroupMemberBalanceSchema = z.object({
    member: GroupMemberSchema,
    iso: z.string().length(3),
    paid_amount: z.number(),
    owed_amount: z.number(),
    net_amount: z.number(),
    status: z.enum(["owes", "is_owed"]),
});

export const GroupDailyTransactionSummarySchema = z.object({
    paid_by: GroupMemberSchema,
    iso: z.string().length(3),
    amount: z.number(),
    date: z.iso.datetime({ offset: true }),
});

export const GroupInviteSchema = z.object({
    group_id: z.uuid(),
    group_member_id: z.uuid(),
    user_id: z.uuid(),
    created_at: z.iso.datetime({ offset: true }),
    accepted_at: z.iso.datetime({ offset: true }).nullish(),
    rejected_at: z.iso.datetime({ offset: true }).nullish(),
});

export const GroupInviteViewSchema = z.object({
    id: z.uuid(),
    group_id: z.uuid(),
    group_member_id: z.uuid(),
    user_id: z.uuid(),
    created_at: z.iso.datetime({ offset: true }),
    accepted_at: z.iso.datetime({ offset: true }),
    group: GroupSchema,
    group_member: GroupMemberSchema,
});

export type Group = z.infer<typeof GroupSchema>;
export type GroupMemberStatus = z.infer<typeof GroupMemberStatusSchema>;
export type GroupMember = z.infer<typeof GroupMemberSchema>;
export type Transaction = z.infer<typeof TransactionSchema>;
export type GroupCurrency = z.infer<typeof GroupCurrencySchema>;
export type TransactionSplit = z.infer<typeof TransactionSplitSchema>;
export type Balance = z.infer<typeof BalanceSchema>;
export type TotalSpentObject = z.infer<typeof TotalSpentObjectSchema>;
export type TransactionWithSplits = z.infer<typeof TransactionWithSplitsSchema>;
export type GroupBalance = z.infer<typeof GroupBalanceSchema>;
export type GroupMemberBalance = z.infer<typeof GroupMemberBalanceSchema>;
export type GroupDailyTransactionSummary = z.infer<
    typeof GroupDailyTransactionSummarySchema
>;
export type GroupInvite = z.infer<typeof GroupInviteSchema>;
export type GroupInviteView = z.infer<typeof GroupInviteViewSchema>;
