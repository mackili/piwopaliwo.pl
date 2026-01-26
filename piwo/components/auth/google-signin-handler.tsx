"use server";

import { createClient } from "@/utils/supabase/server";
import { GoogleCredentialResponse } from "./types";
import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentLocale } from "@/locales/server";

export async function generateNonce() {
    // Adapted from https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest#converting_a_digest_to_a_hex_string

    const nonce = btoa(
        String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))),
    );
    const encoder = new TextEncoder();
    const encodedNonce = encoder.encode(nonce);
    const hashedNonce = await crypto.subtle
        .digest("SHA-256", encodedNonce)
        .then((hashBuffer) => {
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashedNonce = hashArray
                .map((b) => b.toString(16).padStart(2, "0"))
                .join("");
            return hashedNonce;
        });
    return { hashedNonce: hashedNonce, nonce: nonce };

    // Use 'hashedNonce' when making the authentication request to Google
    // Use 'nonce' when invoking the supabase.auth.signInWithIdToken() method
}

export default async function handleSignInWithGoogle(
    response: GoogleCredentialResponse,
    nonce: string,
    redirectTo?: string,
) {
    const localePromise = getCurrentLocale();
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithIdToken({
        provider: "google",
        token: response.credential,
        nonce: nonce,
    });
    if (!error) {
        refresh();
        redirect(redirectTo ? redirectTo : `/${await localePromise}`);
    }
}
