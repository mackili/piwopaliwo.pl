"use server";
import ScoreTracker from "./scoretracker";
import { createClient } from "@/utils/supabase/server";
import { UserScoreSchema } from "@/components/scoretracker/types";

export default async function Page({
    params,
}: {
    params: Promise<{ gameId: string }>;
}) {
    const { gameId } = await params;
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    await supabase
        .from("UserScore")
        .upsert(
            UserScoreSchema.parse({ gameId: gameId, userId: data.user?.id })
        );
    const scores = (
        await supabase
            .from("UserScore")
            .select(`userId, gameId, history, UserInfo (firstName)`)
            .filter("gameId", "eq", gameId)
    ).data?.map((score) => UserScoreSchema.parse(score));

    return (
        <div className="max-w-xxl mx-auto py-10 flex flex-col justify-center-safe items-center-safe gap-6 h-screen">
            <ScoreTracker
                gameId={gameId}
                userId={data.user?.id}
                scores={scores ?? []}
            />
        </div>
    );
}
