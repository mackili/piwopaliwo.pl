"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { User, UserSchema } from "@/components/auth/types";
import { getCurrentLocale } from "@/locales/server";

export async function login(formData: User) {
    const locale = await getCurrentLocale();
    const supabase = await createClient();

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = UserSchema.parse(formData);

    const { error } = await supabase.auth.signInWithPassword(data);

    if (error) {
        redirect(`/${locale}/auth/error`);
    }

    revalidatePath(`/${locale}`, "layout");
    redirect(`/${locale}`);
}

export async function signup(formData: User) {
    const locale = await getCurrentLocale();
    const supabase = await createClient();

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
        redirect(`/${locale}/auth/error`);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const userInfoResponse = await supabase.from("UserInfo").insert({
        userId: signupResponse.data.user?.id,
        firstName: data.firstName,
        lastName: data.lastName,
    });

    revalidatePath(`/${locale}`, "layout");
    redirect(`/${locale}`);
}
