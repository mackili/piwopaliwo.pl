"use client";

import { Button } from "@/components/ui/button";
import { UserScore, UserScoreSchema } from "@/components/scoretracker/types";
import { useState } from "react";

export default function ScoreButton({
    action,
    stepSize = 1,
    clickHandler,
    variant,
    userScore,
    ...props
}: React.ComponentProps<"button"> & {
    action: "increase" | "decrease";
    stepSize?: number;
    clickHandler: (userScore: UserScore) => void;
    variant:
        | "default"
        | "destructive"
        | "outline"
        | "secondary"
        | "ghost"
        | "link";
    userScore: UserScore | undefined;
}) {
    const [buttonStatus, setButtonStatus] = useState<
        "active" | "inactive" | "error"
    >("active");
    // let buttonStatus: "active" | "inactive" | "error" = "active";
    const buttonText = () => {
        switch (action) {
            case "increase":
                return "+";
            default:
                return "-";
        }
    };
    const handleClick = () => {
        setButtonStatus("inactive");
        if (!userScore || !userScore.history) {
            console.error("No userScore or userScore.history");
            setButtonStatus("error");
            return;
        }
        let score = userScore.history[userScore.history.length - 1];
        switch (action) {
            case "increase":
                score += stepSize;
                break;
            case "decrease":
                score -= stepSize;
                break;
            default:
                break;
        }
        userScore.history.push(score);
        fetch("/api/apps/scoretracker/game/update", {
            method: "POST",
            body: JSON.stringify(UserScoreSchema.parse(userScore)),
        }).finally(() => {
            setButtonStatus("active");
        });
    };
    return (
        <Button
            onClick={handleClick}
            disabled={buttonStatus === "inactive"}
            {...props}
        >
            {buttonText()}
        </Button>
    );
}
