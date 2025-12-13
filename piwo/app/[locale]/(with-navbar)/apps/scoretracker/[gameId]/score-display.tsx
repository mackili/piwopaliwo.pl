import { UserScore } from "@/components/scoretracker/types";
import { twMerge } from "tailwind-merge";
export default function ScoreNumber({
    score,
    className,
    ...props
}: { score: UserScore } & React.ComponentProps<"div">) {
    return (
        <div
            className={twMerge(
                "flex items-center-safe justify-center-safe w-full h-full rounded-full bg-accent-foreground opacity-80 hover:opacity-90 transition-all text-accent font-extrabold text-6xl aspect-square",
                className
            )}
            {...props}
        >
            {score?.history && score.history[score.history.length - 1]}
        </div>
    );
}
