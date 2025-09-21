"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import {
    ScoreTrackerGame,
    ScoreTrackerGameSchema,
    enterScoreTrackerGameForm,
} from "@/components/scoretracker/types";
import * as z from "zod";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { SupabaseError } from "@/utils/supabase/types";

const NEW_GAME_API = { url: "/api/apps/scoretracker/game/new", method: "POST" };
const GAME_LINK = (gameId: string | number | undefined) => {
    const baseUrl = "/apps/scoretracker";
    if (!gameId) {
        return baseUrl;
    }
    return `${baseUrl}/${gameId}`;
};

export default function ScoreTrackerHome() {
    const router = useRouter();
    const [isLoading, setLoading] = useState(false);

    async function handleNewTracker(data: ScoreTrackerGame) {
        setLoading(true);
        const res = (await (
            await fetch(NEW_GAME_API.url, {
                method: NEW_GAME_API.method,
                body: JSON.stringify(data),
            })
        ).json()) as ScoreTrackerGame[] | SupabaseError | null;
        if (res && Array.isArray(res) && res.length === 1) {
            const gameData = ScoreTrackerGameSchema.parse(res[0]);
            router.push(GAME_LINK(gameData.id));
        }
        setLoading(false);
    }
    const newTrackerForm = useForm<ScoreTrackerGame>({
        reValidateMode: "onChange",
        resolver: zodResolver(ScoreTrackerGameSchema),
        defaultValues: {
            name: "",
        },
    });

    async function handleJoinTracker(
        values: z.infer<typeof enterScoreTrackerGameForm>
    ) {
        setLoading(true);
        setLoading(false);
        router.push(GAME_LINK(values.id));
    }
    const joinTrackerForm = useForm<z.infer<typeof enterScoreTrackerGameForm>>({
        reValidateMode: "onChange",
        resolver: zodResolver(enterScoreTrackerGameForm),
        defaultValues: {
            id: "",
        },
    });

    return (
        <div className="max-w-md mx-auto py-10 flex flex-col gap-6 h-screen justify-center-safe">
            <h1>Score Tracker</h1>
            <div className="flex flex-col gap-2">
                <Form {...newTrackerForm}>
                    <form
                        className="flex flex-col gap-4 mt-8"
                        onSubmit={newTrackerForm.handleSubmit(handleNewTracker)}
                    >
                        <FormField
                            control={newTrackerForm.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name of game tracked</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Ping-Pong"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        This is your friendly name for the game
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            variant="secondary"
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                        >
                            Create New Game
                        </Button>
                    </form>
                </Form>
            </div>
            <div className="flex justify-center-safe rounded bg-accent shadow-sm">
                <h4>OR</h4>
            </div>
            <Form {...joinTrackerForm}>
                <form
                    className="flex flex-col gap-4 mt-8"
                    onSubmit={joinTrackerForm.handleSubmit(handleJoinTracker)}
                >
                    <FormField
                        control={joinTrackerForm.control}
                        name="id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Game Code</FormLabel>
                                <FormControl>
                                    <Input placeholder="AB4C8F" {...field} />
                                </FormControl>
                                <FormDescription>
                                    This is the code of the game you want to
                                    join.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button
                        variant="default"
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                    >
                        Join Game
                    </Button>
                </form>
            </Form>
        </div>
    );
}
