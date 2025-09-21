import {
    ScoreTrackerGame,
    ScoreTrackerGameSchema,
} from "@/components/scoretracker/types";
import { SupabaseResponseSchema } from "@/utils/supabase/types";
import { NextRequest } from "next/server";
import { createClient, supabaseToNextResponse } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
    const newGame = ScoreTrackerGameSchema.parse(
        (await req.json()) as ScoreTrackerGame
    );
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    newGame.ownerId = data.user?.id;
    const response = await supabase.from("GameScore").upsert(newGame).select();
    const gameScore = SupabaseResponseSchema(ScoreTrackerGameSchema).parse(
        response
    );
    // @ts-expect-error invalid validation
    return supabaseToNextResponse(gameScore);
}
