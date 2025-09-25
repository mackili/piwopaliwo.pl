import { UserScore } from "@/components/scoretracker/types";
import ScoreNumber from "./score-display";
import { useState, useEffect } from "react";

export default function ScoreBoard({
    liveScores,
    userId,
}: {
    liveScores: UserScore[];
    userId: string | undefined;
}) {
    const columns = Math.min(liveScores.length, 4); // max 4 columns for mobile
    const gridClass = `grid sm:grid-cols-${columns} sm:grid-flow-col items-center gap-8 w-full sm:px-8 shrink`;

    return (
        <div className={gridClass}>
            {liveScores.map((score, index) => (
                <div
                    key={index}
                    className={`min-w-[8rem] isolate aspect-square w-full rounded-xl bg-accent/20 shadow-lg hover:shadow-xl ring-1 flex justify-center-safe items-center-safe p-8 flex-col gap-4 backdrop-blur-3xl transition-all  ${
                        score.userId === userId
                            ? "scale-102 hover:scale-104 ring-accent-foreground/50"
                            : "hover:scale-102 ring-accent/50"
                    } @container`}
                >
                    <ScoreNumber
                        score={score}
                        className="min-w-[4rem] min-h-[4rem] @max-3xs:w-full @max-3xs:max-w-[12rem] @max-3xs:max-h-[12rem] @3xs:w-[12rem] @3xs:h-[12rem] @sm:w-3xs @sm:h-[16rem]"
                    />
                    <p className="font-extrabold text-2xl overflow-ellipsis">
                        {score?.UserInfo?.firstName}
                    </p>
                </div>
            ))}
        </div>
    );
}
