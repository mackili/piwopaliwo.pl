import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata } from "next";
import "@/app/globals.css";
import NavBar from "@/components/navbar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LocaleToggle } from "@/components/ui/locale-toggle";

export const metadata: Metadata = {
    title: "Piwo-Paliwo 2.0",
    description: "Beer is fuel",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
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
            <LocaleToggle />
        </ThemeProvider>
    );
}
