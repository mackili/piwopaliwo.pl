import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SupabaseResponse } from "./types";
import { NextResponse } from "next/server";

export async function createClient() {
    const cookieStore = await cookies();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    return createServerClient(supabaseUrl!, supabasePublishableKey!, {
        cookies: {
            getAll() {
                return cookieStore.getAll();
            },
            setAll(cookiesToSet) {
                try {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        cookieStore.set(name, value, options)
                    );
                } catch {
                    // The `setAll` method was called from a Server Component.
                    // This can be ignored if you have middleware refreshing
                    // user sessions.
                }
            },
        },
    });
}

export function supabaseToNextResponse(supabaseResponse: SupabaseResponse) {
    return NextResponse.json(supabaseResponse.error || supabaseResponse.data, {
        status: supabaseResponse.status,
        statusText: supabaseResponse.statusText,
    });
}
