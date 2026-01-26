"use client";
import { useState, useRef, ChangeEvent } from "react";
import { twMerge } from "tailwind-merge";
import { Camera, CircleDashed } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useI18n } from "@/locales/client";
const MAX_SIZE = 2000000; // max image size in bytes
const supabase = createClient();

export async function upsertImage(
    image: File,
    t: ReturnType<typeof useI18n>,
    bucketName: string,
    fileName?: string,
    folderPath?: string,
    elementId?: string,
    maxSize: number = MAX_SIZE,
) {
    if (image.size > maxSize) {
        return { data: null, error: t("Settings.avatarTooBig") };
    }
    const { data, error } = await supabase.storage
        .from(bucketName)
        .update(makeFileName(fileName, folderPath, elementId), image, {
            upsert: true,
            metadata: { parentId: elementId },
        });
    if (error) {
        return { data: null, error: error };
    }
    const { publicUrl } = getFilePublicUrl(data?.path, bucketName);
    return {
        data: { ...data, publicUrl: publicUrl },
        error,
    };
}

function makeFileName(
    fileName?: string,
    folderPath?: string,
    elementId?: string,
) {
    let path = "";
    if (folderPath) path += "/" + folderPath;
    if (elementId) path += "/" + elementId;
    if (fileName) path += "/" + fileName;
    return path;
}

function getFilePublicUrl(imagePath: string, bucketName: string) {
    const { data } = supabase.storage
        .from(bucketName)
        .getPublicUrl(imagePath, { download: false });
    return data;
}

export default function UpsertImage({
    bucketName,
    folderPath,
    elementId,
    fileName,
    className,
    maxSize,
    onSuccess,
    ...props
}: {
    bucketName: string;
    folderPath?: string;
    elementId?: string;
    fileName?: string;
    maxSize?: number;
    onSuccess?: (url?: string) => void;
} & React.ComponentProps<"div">) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const t = useI18n();
    const [uploadStatus, setUploadStatus] = useState<
        "off" | "pending" | "error"
    >("off");
    const [uploadError, setUploadError] = useState<string | null>(null);
    const updateImage = async (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setUploadStatus("pending");
            const file = event.target.files[0];
            const { data, error } = await upsertImage(
                file,
                t,
                bucketName,
                fileName,
                folderPath,
                elementId,
                maxSize,
            );
            // Reset the input so the same file can be selected again if needed
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
            if (error) {
                setUploadStatus("error");
                setUploadError(
                    typeof error === "string" ? error : error.message,
                );
            } else {
                setUploadError(null);
                if (onSuccess) onSuccess(data?.publicUrl);
                setUploadStatus("off");
            }
        }
    };
    return (
        <>
            <div
                className={twMerge(
                    "w-32 h-32 z-20 rounded-full absolute group-hover:bg-primary/20 flex transition-all items-center justify-center",
                    uploadStatus === "pending" && "bg-primary/20",
                    className,
                )}
                {...props}
            >
                <Camera
                    className={twMerge(
                        "opacity-0 transition-all absolute group-hover:opacity-100",
                        uploadStatus === "pending" && "opacity-0",
                    )}
                />
                <CircleDashed
                    className={twMerge(
                        "opacity-0 absolute",
                        uploadStatus === "pending" &&
                            "opacity-100 animate-spin",
                    )}
                />
            </div>
            <input
                type="file"
                className={twMerge(
                    className,
                    "absolute z-30 cursor-pointer opacity-0",
                )}
                ref={fileInputRef}
                accept="image/*"
                onChange={updateImage}
            ></input>
            {uploadError && <p className="text-red-700">{uploadError}</p>}
        </>
    );
}
