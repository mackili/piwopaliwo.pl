import {
    publicTransactionStatusSchema,
    publicTripParticipantStatusSchema,
    publicTripTransactionCategorySchema,
} from "@/database.schemas";
import z from "zod";
const TripTransactionSplitSchema = z.object({
    participantId: z.uuid(),
    amount: z.number().nullish(),
});

export type TripTransactionSplit = z.infer<typeof TripTransactionSplitSchema>;

const TripFinancialsJsonSchema = z.object({
    status: publicTransactionStatusSchema,
    total_in_trip_currency: z.number(),
});

const TripFinancialsPerCategoryJsonSchema = z.object({
    category: publicTripTransactionCategorySchema,
    total_in_trip_currency: z.number(),
});

const TripFinancialsParticipantsJsonSchema = z.object({
    count: z.number(),
    status: publicTripParticipantStatusSchema,
});

export type TripFinancialsJson = z.infer<typeof TripFinancialsJsonSchema>;

export type TripFinancialsPerCategoryJson = z.infer<
    typeof TripFinancialsPerCategoryJsonSchema
>;

export type TripFinancialsParticipantsJson = z.infer<
    typeof TripFinancialsParticipantsJsonSchema
>;

export {
    TripTransactionSplitSchema,
    TripFinancialsJsonSchema,
    TripFinancialsParticipantsJsonSchema,
    TripFinancialsPerCategoryJsonSchema,
};
