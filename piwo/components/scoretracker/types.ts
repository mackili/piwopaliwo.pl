import * as z from "zod";
interface ScoreTrackerPlayer {
    id?: string | number;
    name?: string;
    score?: number | void;
}

export const newScoreTrackerGameForm = z.object({
    name: z.string().max(80).min(2),
});

export const enterScoreTrackerGameForm = newScoreTrackerGameForm.extend({
    id: z.union([z.string().min(6), z.int().min(6)]),
});

export type ScoreTrackerPlayerRequest = ScoreTrackerPlayer;

export interface ScoreTrackerPlayerResponse extends ScoreTrackerPlayer {
    id: string | number;
}

export type ScoreTrackerGame = {
    code: string;
    players?: ScoreTrackerPlayerResponse[];
};
