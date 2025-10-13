"use client";
import { CurrentUserAvatar } from "@/components/current-user-avatar";
import { useState, useRef, ChangeEvent } from "react";
import upsertAvatar from "./upsert-user-avatar";
import { User } from "@supabase/supabase-js";
import { twMerge } from "tailwind-merge";
import { Camera, CircleDashed } from "lucide-react";
import { useI18n } from "@/locales/client";

export function UserAvatar({ user }: { user: User | null | undefined }) {
    const t = useI18n();
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [uploadStatus, setUploadStatus] = useState<
        "off" | "pending" | "error"
    >("off");
    const [uploadError, setUploadError] = useState<string | null>(null);
    const updateImage = async (event: ChangeEvent<HTMLInputElement>) => {
        if (user && user.id && event.target.files && event.target.files[0]) {
            setUploadStatus("pending");
            const file = event.target.files[0];
            const { error } = await upsertAvatar(file, user.id, t);
            // Reset the input so the same file can be selected again if needed
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
            if (error) {
                setUploadStatus("error");
                setUploadError(
                    typeof error === "string" ? error : error.message
                );
            } else {
                setUploadError(null);
                setUploadStatus("off");
            }
        }
    };
    return (
        <div className="flex flex-col items-center-safe">
            <div
                className={twMerge(
                    "w-32 h-32 container z-10 rounded-full group",
                    uploadStatus === "pending" && "bg-primary/20"
                )}
            >
                <CurrentUserAvatar
                    className="w-32 h-32 font-extrabold text-2xl absolute z-0"
                    user={user}
                />
                <div
                    className={twMerge(
                        "w-32 h-32 z-20 rounded-full absolute group-hover:bg-primary/20 flex transition-all items-center justify-center",
                        uploadStatus === "pending" && "bg-primary/20"
                    )}
                >
                    <Camera
                        className={twMerge(
                            "opacity-0 transition-all absolute group-hover:opacity-100",
                            uploadStatus === "pending" && "opacity-0"
                        )}
                    />
                    <CircleDashed
                        className={twMerge(
                            "opacity-0 absolute",
                            uploadStatus === "pending" &&
                                "opacity-100 animate-spin"
                        )}
                    />
                </div>
                <input
                    type="file"
                    className="w-32 h-32 absolute z-30 rounded-full cursor-pointer opacity-0"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={updateImage}
                ></input>
            </div>
            <p
                className={`text-red-700 dark:text-red-500 text-sm font-bold pt-4 transition-all ease-in-out ${
                    uploadError ? "opacity-100" : "opacity-0"
                }`}
            >
                {uploadError}
            </p>
        </div>
    );
}
