import { createClient } from "@/utils/supabase/client";
import { ConsumedDrink, ConsumedDrinkSchema } from "./types";
import { TablesInsert } from "@/database.types";

export default async function registerBeer(beer: ConsumedDrink) {
    const reqBody = await ConsumedDrinkSchema.safeParseAsync(beer);
    if (!reqBody.success) {
        return { data: null, error: reqBody.error };
    }
    const supabase = createClient();
    const { data, error } = await supabase
        .from("consumed_drink")
        .upsert(reqBody.data as TablesInsert<"consumed_drink">)
        .select()
        .limit(1)
        .single();
    return { data, error };
}
