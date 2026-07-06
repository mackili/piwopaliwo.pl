"use server";
import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { User, UserSchema } from "@/components/auth/types";
import { getCurrentLocale } from "@/locales/server";

export async function login(formData: User, returnUrl?: string) {
    const [locale, supabase] = await Promise.all([
        getCurrentLocale(),
        createClient(),
    ]);
    // const locale = await getCurrentLocale();
    // const supabase = await createClient();

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = UserSchema.parse(formData);

    const { error } = await supabase.auth.signInWithPassword(data);

    if (error) {
        const errorRedirect = returnUrl
            ? `/${locale}/auth/error?returnUrl=${encodeURIComponent(returnUrl)}`
            : `/${locale}/auth/error`;
        redirect(errorRedirect);
    }

    refresh();

    // Only honor returnUrl if it's a safe, relative path (avoid open redirects)
    const isSafeReturnUrl =
        returnUrl && returnUrl.startsWith("/") && !returnUrl.startsWith("//");
    // redirect(`/${locale}`);
    redirect(isSafeReturnUrl ? returnUrl : `/${locale}`);
}

export async function signup(formData: User, returnUrl?: string) {
    const [locale, supabase] = await Promise.all([
        getCurrentLocale(),
        createClient(),
    ]);
    // const locale = await getCurrentLocale();
    // const supabase = await createClient();

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = UserSchema.parse(formData);
    const signUpData = {
        ...data,
        options: {
            data: {
                firstName: data.firstName,
                lastName: data.lastName,
            },
        },
    };

    const signupResponse = await supabase.auth.signUp(signUpData);

    if (signupResponse.error) {
        const errorRedirect = returnUrl
            ? `/${locale}/auth/error?returnUrl=${encodeURIComponent(returnUrl)}`
            : `/${locale}/auth/error`;
        redirect(errorRedirect);
    }

    refresh();
    // Only honor returnUrl if it's a safe, relative path (avoid open redirects)
    const isSafeReturnUrl =
        returnUrl && returnUrl.startsWith("/") && !returnUrl.startsWith("//");
    // redirect(`/${locale}`);
    redirect(isSafeReturnUrl ? returnUrl : `/${locale}`);
}
