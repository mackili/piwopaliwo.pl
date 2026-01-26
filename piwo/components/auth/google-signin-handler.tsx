"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function handleSignInWithGoogle() {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: "http://localhost:3000/auth/v1/callback",
        },
    });

    if (data.url) {
        redirect(data.url);
    }
    if (error) {
        redirect("/auth/error");
    }
}
