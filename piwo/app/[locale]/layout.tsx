import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Lato, Outfit } from "next/font/google";
import "../globals.css";
import NavBar from "@/components/navbar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { I18nProviderClient } from "../../locales/client";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

const lato = Lato({
    variable: "--font-lato",
    weight: ["100", "300", "400", "700", "900"],
    subsets: ["latin"],
});

const outfit = Outfit({
    variable: "--font-outfit",
    weight: ["100", "300", "400", "700", "900"],
    subsets: ["latin"],
});

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
        // <html lang="en" suppressHydrationWarning>
        //     <body
        //         className={`${outfit.className} ${geistMono.variable} antialiased`}
        //     >
        <I18nProviderClient locale={locale}>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                <NavBar />
                {children}
                <footer className="row-start-3 flex gap-[24px] pb-8 flex-wrap items-center justify-center">
                    Piwo Paliwo 2.0 {new Date().getFullYear()}
                </footer>
                <ThemeToggle />
            </ThemeProvider>
        </I18nProviderClient>
        //     </body>
        // </html>
    );
}
