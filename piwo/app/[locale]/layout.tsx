import type { Metadata } from "next";
import "@/app/globals.css";
import { I18nProviderClient } from "@/locales/client";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LocaleToggle } from "@/components/ui/locale-toggle";

export const metadata: Metadata = {
    title: "Piwo-Paliwo 2.0",
    description: "Beer is fuel",
};

export default async function RootLayout({
    params,
    children,
}: Readonly<{
    params: Promise<{ locale: string }>;
    children: React.ReactNode;
}>) {
    const { locale } = await params;
    return (
        <I18nProviderClient locale={locale}>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                {children}
                <ThemeToggle />
                <LocaleToggle />
            </ThemeProvider>
        </I18nProviderClient>
    );
}
