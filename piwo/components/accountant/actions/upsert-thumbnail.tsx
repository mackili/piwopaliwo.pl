"use client";
import { createClient } from "@/utils/supabase/client";
// import { useI18n } from "@/locales/client";
const BUCKET_NAME = "accountant";
// const MAX_SIZE = 2000000; // max image size in bytes
export async function upsertThumbnail(image: File, groupId: string) {
    const supabase = createClient();
    const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .update(`/thumbnails/${groupId}`, image, {
            upsert: true,
            metadata: { groupId: groupId },
        });
    if (error) {
        return { data: null, error: error };
    }
    const { publicUrl } = await getThumbnailPublicUrl(data?.path);
    return {
        data: { ...data, publicUrl: publicUrl },
        error,
    };
}

async function getThumbnailPublicUrl(ThumbnailPath: string) {
    const supabase = await createClient();
    const { data } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(ThumbnailPath, { download: false });
    return data;
}
