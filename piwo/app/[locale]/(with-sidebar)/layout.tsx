import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata } from "next";
import "@/app/globals.css";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { I18nProviderClient } from "@/locales/client";
import { LocaleToggle } from "@/components/ui/locale-toggle";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./sidebar";
import { createClient } from "@/utils/supabase/server";

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
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    return (
        <I18nProviderClient locale={locale}>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                <SidebarProvider>
                    <AppSidebar user={data?.user} />
                    <main className="w-full">
                        <SidebarTrigger />
                        {children}
                    </main>
                </SidebarProvider>
                <ThemeToggle />
                <LocaleToggle />
            </ThemeProvider>
        </I18nProviderClient>
    );
}
