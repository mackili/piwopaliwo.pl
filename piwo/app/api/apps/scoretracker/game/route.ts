import {
    ScoreTrackerGame,
    ScoreTrackerPlayerRequest,
} from "@/components/scoretracker/types";
import { NextRequest, NextResponse } from "next/server";

const GAME_CODE_LENGTH = 6;

export async function POST(req: NextRequest) {
    const newGameDetails: ScoreTrackerGame = {
        code: generateCode(),
        players: [
            {
                id: 0,
                name: ((await req.json()) as ScoreTrackerPlayerRequest).name,
            },
        ],
    };
    return NextResponse.json(newGameDetails);
}

function generateCode() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < GAME_CODE_LENGTH; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
