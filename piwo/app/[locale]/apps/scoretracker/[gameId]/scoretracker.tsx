"use client";
import { createClient } from "@/utils/supabase/client";
import { UserScore } from "@/components/scoretracker/types";
import { useState, useEffect } from "react";
import ScoreButton from "./score-button";
import ScoreBoard from "./scoreboard";
import {
    RealtimePostgresInsertPayload,
    RealtimePostgresUpdatePayload,
} from "@supabase/supabase-js";

export default function ScoreTracker({
    gameId,
    userId,
    scores,
}: {
    gameId: string;
    userId: string | undefined;
    scores?: UserScore[];
}) {
    const [liveScores, setScores] = useState<UserScore[]>(scores || []);
    const [userScore, setUserScore] = useState<UserScore | undefined>(
        undefined
    );
    const supabase = createClient();

    useEffect(() => {
        setUserScore(liveScores.find((score) => score.userId === userId));
        const updateLiveScores = (
            payload:
                | RealtimePostgresInsertPayload<UserScore>
                | RealtimePostgresUpdatePayload<UserScore>
        ) => {
            const scoreUpdate = payload.new as UserScore | null;
            if (!scoreUpdate) {
                return;
            }
            const scoresUpdated = (() => {
                const found = liveScores.some(
                    (score) =>
                        score.gameId === scoreUpdate.gameId &&
                        score.userId === scoreUpdate.userId
                );
                if (found) {
                    return liveScores.map((score) =>
                        score.gameId === scoreUpdate.gameId &&
                        score.userId === scoreUpdate.userId
                            ? { ...score, ...scoreUpdate }
                            : { ...score }
                    );
                } else {
                    console.log(scoreUpdate);
                    return [...liveScores, scoreUpdate];
                }
            })();
            setScores(scoresUpdated);
        };
        const channel = supabase
            .channel("supabase_realtime")
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "UserScore",
                    filter: `gameId=eq.${gameId}`,
                },
                updateLiveScores
            )
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "UserScore",
                    filter: `gameId=eq.${gameId}`,
                },
                updateLiveScores
            )
            .subscribe((status, err) => {
                if (err) console.error("SUBSCRIPTION ERROR:", err);
                else console.log("SUBSCRIPTION STATUS CHANGED:", status);
            });
        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase, liveScores, setScores, gameId, userId]);

    // useEffect(() => {}, [userScore]);
    return (
        <div className="flex justify-center-safe flex-row sm:flex-col px-8 py-8 gap-8 w-full h-screen items-center-safe">
            <ScoreBoard userId={userId} liveScores={liveScores} />
            <div className="grid sm:grid-cols-2 gap-16 sm:gap-16 sm:grid-flow-row max-w-128">
                <ScoreButton
                    action="increase"
                    userScore={userScore}
                    clickHandler={setUserScore}
                    variant="default"
                    className="sm:order-2 h-[10rem] w-16 sm:h-[5rem] sm:w-[5rem]"
                />
                <ScoreButton
                    action="decrease"
                    userScore={userScore}
                    clickHandler={setUserScore}
                    variant="default"
                    className="sm:order-1 h-[10rem] w-16 sm:h-[5rem] sm:w-[5rem]"
                />
            </div>
        </div>
    );
}
