import * as z from "zod";
interface ScoreTrackerPlayer {
    id?: string | number;
    name?: string;
    score?: number | void;
}

export const ScoreTrackerGameSchema = z.object({
    id: z.uuidv4().optional(),
    name: z.string(),
    status: z.enum(["paused", "active", "finished"]).optional(),
    createdAt: z.iso.datetime({ offset: true }).optional(),
    finishedAt: z.iso.datetime({ offset: true }).nullish(),
    ownerId: z.uuidv4().optional(),
});

export type ScoreTrackerGame = z.infer<typeof ScoreTrackerGameSchema>;

export const UserInfoSchema = z.object({
    userId: z.uuidv4().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    avatarUrl: z.url().nullish(),
});

export type UserInfo = z.infer<typeof UserInfoSchema>;

export const UserScoreSchema = z.object({
    gameId: z.uuidv4(),
    userId: z.uuidv4(),
    createdAt: z.iso.datetime({ offset: true }).optional(),
    updatedAt: z.iso.datetime({ offset: true }).optional(),
    history: z.array(z.int32()).optional(),
    UserInfo: UserInfoSchema.nullish(),
});

export type UserScore = z.infer<typeof UserScoreSchema>;

export const newScoreTrackerGameForm = z.object({
    firstName: z.string().max(80).min(2),
});

export const enterScoreTrackerGameForm = z.object({
    id: z.string(),
});

export type ScoreTrackerPlayerRequest = ScoreTrackerPlayer;

export interface ScoreTrackerPlayerResponse extends ScoreTrackerPlayer {
    id: string | number;
}
