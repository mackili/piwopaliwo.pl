"use client";
import { createClient } from "@/lib/supabase/client";
import { useI18n } from "@/locales/client";
const BUCKET_NAME = "avatars";
const MAX_SIZE = 2000000; // max image size in bytes
const supabase = createClient();
export default async function upsertAvatar(
    image: File,
    userId: string,
    t: ReturnType<typeof useI18n>
) {
    if (image.size > MAX_SIZE) {
        return { data: null, error: t("Settings.avatarTooBig") };
    }
    const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .update(avatarName(userId), image, {
            upsert: true,
            metadata: { userId: userId },
        });
    if (error) {
        return { data: null, error: error };
    }
    const { publicUrl } = getAvatarPublicUrl(data?.path);
    await updateAvatarUrlOnUser(publicUrl);
    return {
        data: { ...data, publicUrl: publicUrl },
        error,
    };
}

function avatarName(userId: string) {
    return `/${userId}/avatar`;
}

function getAvatarPublicUrl(avatarPath: string) {
    const { data } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(avatarPath, { download: false });
    return data;
}

async function updateAvatarUrlOnUser(publicUrl: string) {
    await supabase.auth.updateUser({ data: { avatarUrl: publicUrl } });
}
