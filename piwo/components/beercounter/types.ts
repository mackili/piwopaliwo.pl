import * as z from "zod";
export const drinkTypes = ["beer"];

export const ConsumedDrinkSchema = z.object({
    id: z.uuidv4(),
    user_id: z.uuidv4(),
    created_at: z.iso.datetime({ offset: true }).optional(),
    drank_at: z.iso.datetime({ offset: true }),
    quantity: z.int32(),
    drink_type: z.enum(drinkTypes),
});

export type ConsumedDrink = z.infer<typeof ConsumedDrinkSchema>;
