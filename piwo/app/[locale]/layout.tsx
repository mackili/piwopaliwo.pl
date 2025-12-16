import type { Metadata } from "next";
import "@/app/globals.css";
import { I18nProviderClient } from "@/locales/client";

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
    return <I18nProviderClient locale={locale}>{children}</I18nProviderClient>;
}
