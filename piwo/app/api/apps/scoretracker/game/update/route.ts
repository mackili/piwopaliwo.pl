import { NextRequest } from "next/server";
import { SupabaseResponseSchema } from "@/utils/supabase/types";
import { createClient, supabaseToNextResponse } from "@/utils/supabase/server";
import { UserScoreSchema } from "@/components/scoretracker/types";

export async function POST(req: NextRequest) {
    const parsedScore = UserScoreSchema.parse(await req.json());
    if (parsedScore.UserInfo) {
        delete parsedScore.UserInfo;
    }
    const supabase = await createClient();
    const response = await supabase.from("UserScore").upsert(parsedScore);
    return supabaseToNextResponse(response);
}
