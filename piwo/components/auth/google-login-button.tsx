"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import handleSignInWithGoogle, { generateNonce } from "./google-signin-handler";
import type { GoogleCredentialResponse } from "./types";

declare global {
    interface Window {
        google?: {
            accounts: {
                id: {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    initialize: (opts: any) => void;
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    renderButton: (parent: HTMLElement, opts: any) => void;
                };
            };
        };
    }
}

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export default function GoogleLoginButton({
    context,
}: {
    context: "signin_with" | "signup_with";
}) {
    const buttonRef = useRef<HTMLDivElement>(null);

    const [gsiLoaded, setGsiLoaded] = useState(false);
    const [nonceData, setNonceData] = useState<{
        nonce: string;
        hashedNonce: string;
    } | null>(null);

    useEffect(() => {
        let mounted = true;
        generateNonce().then((result) => {
            if (!mounted) return;
            setNonceData(result);
        });
        return () => {
            mounted = false;
        };
    }, []);

    useEffect(() => {
        if (!gsiLoaded) return;
        if (!nonceData) return;
        if (!buttonRef.current) return;
        if (!window.google?.accounts?.id) return;

        // Re-render safely (React rerenders / route transitions)
        buttonRef.current.innerHTML = "";

        window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            context: "signin",
            ux_mode: "popup",
            nonce: nonceData.hashedNonce,
            use_fedcm_for_prompt: true,
            use_fedcm_for_button: true,
            callback: async (response: GoogleCredentialResponse) => {
                await handleSignInWithGoogle(response, nonceData.nonce);
            },
        });

        window.google.accounts.id.renderButton(buttonRef.current, {
            type: "standard",
            shape: "pill",
            theme: "filled_black",
            text: context,
            size: "large",
            logo_alignment: "left",
            // width: 400,
        });
    }, [gsiLoaded, nonceData, context]);

    return (
        <>
            {nonceData && (
                <div className="w-full flex justify-center">
                    <Script
                        src="https://accounts.google.com/gsi/client"
                        strategy="afterInteractive"
                        onReady={() => setGsiLoaded(true)}
                    />
                    <div
                        ref={buttonRef}
                        className="flex justify-center scheme-light"
                    />
                </div>
            )}
        </>
    );
}
