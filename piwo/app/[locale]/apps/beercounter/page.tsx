"use server";

import NewBeer from "@/components/beercounter/new-beer";
import { createClient } from "@/utils/supabase/server";

export default async function Page() {
    const supabase = await createClient();
    const user = await supabase.auth.getUser();
    if (!user?.data?.user) {
        return <></>;
    }
    return (
        <div className="w-full mt-50 h-screen">
            <div className="flex items-center justify-center-safe w-full">
                <NewBeer user={user.data.user} />
            </div>
        </div>
    );
}
