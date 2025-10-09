"use client";

import { Button } from "@/components/ui/button";
import { useCurrentLocale, useI18n } from "@/locales/client";
import Link from "next/link";

export default function ErrorPage() {
    const t = useI18n();
    const locale = useCurrentLocale();
    return (
        <div className="h-screen w-full flex flex-col gap-8 items-center-safe justify-center-safe">
            <h1>Sorry, something went wrong</h1>
            <Link href={`/${locale}`}>
                <Button>{t("NavMenu.home")}</Button>
            </Link>
        </div>
    );
}
