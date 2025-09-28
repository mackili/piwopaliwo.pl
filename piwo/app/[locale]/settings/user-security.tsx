"use client";
import { UserResponse } from "@supabase/supabase-js";
import ChangePasswordForm from "./change-password";

export default function UserSecurity({ user }: { user: UserResponse }) {
    return (
        <div className="w-full h-full flex gap-6 my-6">
            <section className="flex gap-4 flex-col w-full">
                <ChangePasswordForm />
            </section>
        </div>
    );
}
