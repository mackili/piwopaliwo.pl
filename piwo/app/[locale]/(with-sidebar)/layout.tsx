import type { Metadata } from "next";
import "@/app/globals.css";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./sidebar";
import { createClient } from "@/utils/supabase/server";
import { TopBar } from "./top-bar";

export const metadata: Metadata = {
    title: "Piwo-Paliwo 2.0",
    description: "Beer is fuel",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    return (
        <SidebarProvider>
            <AppSidebar user={data?.user} />
            <SidebarInset>
                <TopBar />
                <section className="flex-1 w-full overflow-y-auto">
                    {children}
                </section>
            </SidebarInset>
        </SidebarProvider>
    );
}
