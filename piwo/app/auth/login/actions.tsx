"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { User, UserSchema } from "@/components/auth/types";

export async function login(formData: User) {
    const supabase = await createClient();

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = UserSchema.parse(formData);

    const { error } = await supabase.auth.signInWithPassword(data);

    if (error) {
        redirect("/auth/error");
    }

    revalidatePath("/", "layout");
    redirect("/");
}

export async function signup(formData: User) {
    const supabase = await createClient();

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = UserSchema.parse(formData);

    const { error } = await supabase.auth.signUp(data);

    if (error) {
        redirect("/auth/error");
    }

    revalidatePath("/", "layout");
    redirect("/");
}
