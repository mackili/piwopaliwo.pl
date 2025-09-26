import type { Metadata } from "next";
import {
    // Geist,
    Geist_Mono,
    Noto_Sans,
    Noto_Serif,
    Outfit,
} from "next/font/google";
import "./globals.css";
// import NavBar from "@/components/navbar";
// import { ThemeToggle } from "@/components/ui/theme-toggle";

// const geistSans = Geist({
//     variable: "--font-geist-sans",
//     subsets: ["latin"],
// });

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

const notoSerif = Noto_Serif({
    variable: "--font-noto-serif",
    subsets: ["latin"],
});

const notoSans = Noto_Sans({
    variable: "--font-noto-sans",
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

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${outfit.variable} ${geistMono.variable} ${notoSerif.variable} ${notoSans.variable} antialiased font-sans`}
            >
                {children}
            </body>
        </html>
    );
}
