"use client";

import * as React from "react";
import { useChangeLocale, useCurrentLocale } from "@/locales/client";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function LocaleToggle() {
    const changeLocale = useChangeLocale();
    const locale = useCurrentLocale();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="fixed bottom-14 right-4 z-100"
                >
                    {locale.toUpperCase()}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => changeLocale("pl")}>
                    Polski
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLocale("en")}>
                    English
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
