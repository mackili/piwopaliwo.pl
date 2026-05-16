import {
    publicTransactionStatusSchema,
    publicTripParticipantStatusSchema,
    publicTripTransactionCategorySchema,
    publicVTripAccommodationSummaryRowSchema,
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
    accommodation_id: z.string(),
    id: z.string(),
    name: z.string(),
    capacity: z.int().nullable(),
    assigned_participants: z.int(),
    assignments: z.array(publicVTripParticipantDetailsRowSchema),
});

const TripAccommodationSummaryViewSchema =
    publicVTripAccommodationSummaryRowSchema.extend({
        accommodation_units: z.array(TripAccommodationUnitSummarySchema),
    });

export type TripAccommodationUnitSummary = z.infer<
    typeof TripAccommodationUnitSummarySchema
>;

export type TripAccommodationSummaryView = z.infer<
    typeof TripAccommodationSummaryViewSchema
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
    TripAccommodationSummaryViewSchema,
};
