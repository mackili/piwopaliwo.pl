import { createClient } from "@/utils/supabase/client";
import { Card, CardContent } from "../ui/card";
import type { FileObject } from "@supabase/storage-js";
import Image from "next/image";
import { BLOG_IMAGE_BUCKET_NAME } from "./image-drawer-grid";
import { CheckIcon, ClipboardCopy } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

export function imageMarkdownTextGenerator(publicUrl: string, name: string) {
    return `![${name}](${publicUrl})`;
}

const NOT_SELECTABLE_FILE_NAMES = ["thumbnail", "banner"];

export default function ImageGridItem({
    image,
    textDocumentFolderPath,
    isSelected = false,
    onSelect,
}: {
    image: FileObject;
    textDocumentFolderPath: string;
    isSelected?: boolean;
    onSelect?: (file: FileObject) => void;
}) {
    const supabase = createClient();
    const imagePath = `${textDocumentFolderPath}/${image.name}`;
    const [isCopied, setIsCopied] = useState(false);
    const { data } = supabase.storage
        .from(BLOG_IMAGE_BUCKET_NAME)
        .getPublicUrl(imagePath, {
            download: false,
        });
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(
                imageMarkdownTextGenerator(data.publicUrl, image.name),
            );
            setIsCopied(true);
            setTimeout(() => {
                setIsCopied(false);
            }, 2000);
        } catch (e) {
            console.error(e);
        }
    };

    const handleSelect = () => {
        if (onSelect) onSelect(image);
    };
    return (
        <Card className="aspect-square p-0 gap-2 relative group">
            <div className="absolute bottom-0 inset-x-0 w-full flex justify-center">
                <p className="bg-card px-2 rounded-t-md text-sm">
                    {image.name}
                </p>
            </div>
            <CardContent className="p-0 w-full h-full rounded-xl">
                <Image
                    src={data.publicUrl}
                    height={150}
                    width={150}
                    alt={image.name}
                    className={twMerge(
                        "w-full h-full rounded-md",
                        isSelected && "border-accent-foreground border-2",
                    )}
                    style={{ objectFit: "cover" }}
                />
            </CardContent>
            <Button
                variant="ghost"
                className="absolute w-full h-full aspect-square not-hover:opacity-30 transition-all"
                type="button"
                onClick={handleCopy}
            >
                {isCopied ? <CheckIcon /> : <ClipboardCopy />}
            </Button>
            <Button
                variant={isSelected ? "default" : "outline"}
                className={twMerge(
                    "absolute top-1 left-1 aspect-square rounded-full size-6 opacity-0 group-hover:opacity-100 transition-all ease-in-out",
                    isSelected && "opacity-70",
                    NOT_SELECTABLE_FILE_NAMES.includes(image.name) && "hidden",
                )}
                size="icon"
                onClick={handleSelect}
            >
                <CheckIcon />
            </Button>
        </Card>
    );
}
