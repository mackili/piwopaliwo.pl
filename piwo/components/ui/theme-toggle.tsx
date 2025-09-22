"use client";

import * as React from "react";
import { Beer, CircleQuestionMark, Computer, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const themeIcons = {
    light: Sun,
    dark: Moon,
    system: Computer,
    beer: Beer,
};

function toTitleCase(str: string) {
    return str.replace(
        /\w\S*/g,
        (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
    );
}

export function ThemeToggle() {
    const { themes, setTheme, theme } = useTheme();
    const [hasMounted, setHasMounted] = React.useState(false);

    React.useEffect(() => {
        setHasMounted(true);
    }, []);
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="fixed bottom-4 right-4"
                >
                    {hasMounted ? (
                        (() => {
                            const Icon =
                                themeIcons[theme as keyof typeof themeIcons] ||
                                CircleQuestionMark;
                            return <Icon className="w-4 h-4" />;
                        })()
                    ) : (
                        <Computer className="w-4 h-4" />
                    )}
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {themes.map((theme, index) => {
                    const Icon =
                        themeIcons[theme as keyof typeof themeIcons] ||
                        CircleQuestionMark;
                    return (
                        <DropdownMenuItem
                            key={index}
                            onClick={() => setTheme(theme)}
                            className="flex items-center gap-2"
                        >
                            <Icon className="w-4 h-4" />
                            {toTitleCase(theme)}
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
