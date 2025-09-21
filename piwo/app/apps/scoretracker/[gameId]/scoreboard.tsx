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
    const gridClass = `grid grid-cols-${columns} sm:grid-flow-col gap-8`;
    const cardWidth = columns > 2 ? "w-64" : "w-96";
    const [cardMaxWidth, setCardMaxWidth] = useState();

    useEffect(() => {
        function handleResize() {
            const padding = 32 * columns; // gap-8 = 32px per gap
            const availableWidth = window.innerWidth - padding;
            const width = Math.max(160, Math.floor(availableWidth / columns)); // min 160px
            setCardMaxWidth(`max-w-[${width}px]`);
        }
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [columns]);

    return (
        <div className={gridClass}>
            {liveScores.map((score, index) => (
                <div
                    key={index}
                    className={`isolate aspect-video ${cardWidth} ${cardMaxWidth} rounded-xl bg-accent/20 shadow-lg hover:shadow-xl ring-1 flex justify-center-safe items-center-safe p-8 flex-col gap-4 backdrop-blur-3xl transition-all  ${
                        score.userId === userId
                            ? "scale-102 hover:scale-104 ring-accent-foreground/50"
                            : "hover:scale-102 ring-accent/50"
                    }`}
                >
                    <ScoreNumber
                        score={score}
                        className="w-[12rem] h-[12rem] @md:w-3xs @md:h-[16rem]"
                    />
                    <p className="font-extrabold text-2xl">
                        {score?.UserInfo?.firstName}
                    </p>
                </div>
            ))}
        </div>
    );
}
