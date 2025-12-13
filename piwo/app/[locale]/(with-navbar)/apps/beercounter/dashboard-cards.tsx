import * as z from "zod";
export const CardInterface = z.object({
    id: z.uuid(),
    name: z.string(),
    label: z.string().nullable(),
    description: z.string().nullish(),
    footer: z.string().nullish(),
});
export const CardSchema = CardInterface.and(
    z.object({
        value: z.union([z.string(), z.number()]).nullish(),
        badge: z.string().nullish(),
    })
);

export type Card = z.infer<typeof CardSchema>;

export const CardDefinitionSchema = CardInterface.and(
    z.object({ valueSelector: z.string(), badgeSelector: z.string().nullish() })
);

export type CardDefinition = z.infer<typeof CardDefinitionSchema>;

export const cards: (
    cardDefinitions: z.infer<typeof CardDefinitionSchema>[],
    data: Record<
        string,
        string | number | boolean | null | undefined | Array<string | number>
    >[]
) => z.infer<typeof CardSchema>[] = (cardDefinitions, data) => {
    return (cardDefinitions || []).map((definition) => {
        const val = definition.valueSelector
            ? new Function("data", definition.valueSelector)
            : null;
        const badge = definition.badgeSelector
            ? new Function("data", definition.badgeSelector)
            : null;
        return {
            ...definition,
            value: val && val(data),
            badge: badge && badge(data),
        };
    });
};

export const card: (
    cardDefinition: z.infer<typeof CardDefinitionSchema>,
    data: Record<
        string,
        string | number | boolean | null | undefined | Array<string | number>
    >[]
) => Promise<z.infer<typeof CardSchema>> = async (cardDefinition, data) => {
    const val = cardDefinition.valueSelector
        ? new Function("data", cardDefinition.valueSelector)
        : null;
    const badge = cardDefinition.badgeSelector
        ? new Function("data", cardDefinition.badgeSelector)
        : null;
    return {
        ...cardDefinition,
        value: val && val(data),
        badge: badge && badge(data),
    };
};
