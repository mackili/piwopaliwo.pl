import {
    publicTransactionStatusSchema,
    publicTripParticipantStatusSchema,
    publicTripTransactionCategorySchema,
    publicVTripParticipantDetailsRowSchema,
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

const TripAccommodationUnitSummarySchema = z.object({
    accommodation_unit_id: z.string(),
    accommodation_unit_name: z.string(),
    accommodation_unit_capacity: z.int().nullable(),
    assigned_participants: z.int(),
    assignments: z.array(publicVTripParticipantDetailsRowSchema),
});
export type TripAccommodationUnitSummary = z.infer<
    typeof TripAccommodationUnitSummarySchema
>;

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
    TripAccommodationUnitSummarySchema,
};
