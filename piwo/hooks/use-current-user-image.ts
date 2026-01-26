import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export const useCurrentUserImage = (user?: User | null) => {
    const [image, setImage] = useState<string | null>(
        user?.user_metadata?.avatarUrl || null,
    );

    useEffect(() => {
        if (!user || !user?.user_metadata || !user?.user_metadata?.avatarUrl) {
            const fetchUserImage = async () => {
                const { data, error } = await createClient().auth.getSession();
                if (error) {
                    console.error(error);
                }
                setImage(data.session?.user.user_metadata?.avatarUrl ?? null);
            };
            fetchUserImage();
        }
    }, [user]);

    return image;
};
