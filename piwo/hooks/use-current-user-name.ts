import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export const useCurrentUserName = (user?: User | null) => {
    const [name, setName] = useState<string | null>(
        user?.user_metadata?.firstName && user?.user_metadata?.lastName
            ? `${user?.user_metadata?.firstName} ${user?.user_metadata?.lastName}`
            : null
    );

    useEffect(() => {
        if (!name || name.length === 0) {
            const fetchProfileName = async () => {
                const { data, error } = await createClient().auth.getSession();
                if (error) {
                    console.error(error);
                }
                setName(
                    `${data.session?.user.user_metadata?.firstName} ${data.session?.user.user_metadata?.lastName}`
                );
            };

            fetchProfileName();
        }
    }, [name]);

    return name || "?";
};
