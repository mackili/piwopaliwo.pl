"use client";
import { ScoreTrackerGame } from "@/components/scoretracker/types";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import {
    newScoreTrackerGameForm,
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

const NEW_GAME_API = { url: "/api/apps/scoretracker/game", method: "POST" };
const GAME_LINK = (gameId: string | number | undefined) => {
    return `/apps/scoretracker/${gameId}`;
};

export default function ScoreTrackerHome() {
    const router = useRouter();
    const [isLoading, setLoading] = useState(false);

    async function handleNewTracker(
        values: z.infer<typeof newScoreTrackerGameForm>
    ) {
        setLoading(true);
        const res = await fetch(NEW_GAME_API.url, {
            method: NEW_GAME_API.method,
            body: JSON.stringify(values),
        });
        const gameData = (await res.json()) as ScoreTrackerGame;
        setLoading(false);
        router.push(GAME_LINK(gameData.code));
    }
    const newTrackerForm = useForm<z.infer<typeof newScoreTrackerGameForm>>({
        reValidateMode: "onChange",
        resolver: zodResolver(newScoreTrackerGameForm),
        defaultValues: {
            name: "",
        },
    });

    async function handleJoinTracker(
        values: z.infer<typeof enterScoreTrackerGameForm>
    ) {
        setLoading(true);
        const res = await fetch(NEW_GAME_API.url, {
            method: NEW_GAME_API.method,
            body: JSON.stringify(values),
        });
        const gameData = (await res.json()) as ScoreTrackerGame;
        setLoading(false);
        router.push(GAME_LINK(gameData.code));
    }
    const joinTrackerForm = useForm<z.infer<typeof enterScoreTrackerGameForm>>({
        reValidateMode: "onChange",
        resolver: zodResolver(enterScoreTrackerGameForm),
        defaultValues: {
            id: "",
            name: "",
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
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        This is your public display name.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            variant="outline"
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                        >
                            Create Game
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
                    <FormField
                        control={joinTrackerForm.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="John" {...field} />
                                </FormControl>
                                <FormDescription>
                                    This is your public display name.
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
