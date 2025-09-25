"use client";

import * as React from "react";
import { Beer, CircleQuestionMark, Computer, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useI18n } from "@/locales/client";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function toTitleCase(str: string) {
    return str.replace(
        /\w\S*/g,
        (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
    );
}

export function ThemeToggle() {
    const t = useI18n();
    const themeIcons = {
        light: Sun,
        dark: Moon,
        system: Computer,
        beer: Beer,
    };
    const themeLabels = {
        light: t("light"),
        dark: t("dark"),
        system: t("system"),
        beer: t("beer"),
    };
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
                    <span className="sr-only">{t("toggleTheme")}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {themes.map((theme, index) => {
                    const Icon =
                        themeIcons[theme as keyof typeof themeIcons] ||
                        CircleQuestionMark;
                    const label =
                        themeLabels[theme as keyof typeof themeLabels];
                    return (
                        <DropdownMenuItem
                            key={index}
                            onClick={() => setTheme(theme)}
                            className="flex items-center gap-2"
                        >
                            <Icon className="w-4 h-4" />
                            {toTitleCase(label)}
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
