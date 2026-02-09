"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import type { FileObject, StorageError } from "@supabase/storage-js";
import LoadingSpinner from "../ui/loading-spinner";
import PostgrestErrorDisplay from "../ui/postgrest-error-display";
import ImageGridItem from "./image-grid-item";
import { Button } from "../ui/button";
import UploadImageItem from "./upload-image-item";

export const BLOG_IMAGE_BUCKET_NAME = "public_images";

type SupabaseStorageListResponse =
    | {
          data: FileObject[];
          error: null;
      }
    | {
          data: null;
          error: StorageError;
      };

export default function ImageDrawerGrid({
    textDocumentId,
}: {
    textDocumentId: string;
}) {
    const textDocumentFolderPath = `blog/posts/${textDocumentId}`;
    const [data, setData] = useState<SupabaseStorageListResponse | "loading">(
        "loading",
    );
    const [selectedFiles, setSelectedFiles] = useState<FileObject[]>([]);
    const [isDeleteLoading, setDeleteLoading] = useState<boolean>(false);
    const handleGetImages = useCallback(
        async function getImages() {
            const supabase = createClient();
            const data = await supabase.storage
                .from(BLOG_IMAGE_BUCKET_NAME)
                .list(textDocumentFolderPath);
            console.log(data);
            setData(data);
        },
        [textDocumentFolderPath],
    );
    useEffect(() => {
        handleGetImages();
    }, [handleGetImages]);

    async function handleDeleteSelected() {
        if (typeof data === "string" || !data?.data) {
            return;
        }
        setDeleteLoading(true);
        const files = [...selectedFiles];
        const removedIds = files.map((file) => file.id);
        const pathsToRemove = files.map(
            (file) => `${textDocumentFolderPath}/${file.name}`,
        );
        const supabase = createClient();
        const { error } = await supabase.storage
            .from(BLOG_IMAGE_BUCKET_NAME)
            .remove(pathsToRemove);
        if (error) {
            console.error(error);
            setDeleteLoading(false);
            return error;
        }
        const oldData = { ...data };
        const newFiles = oldData.data.filter(
            (file) => !removedIds.includes(file.id),
        );
        const newData = { ...oldData, data: newFiles };
        setData(newData);
        setSelectedFiles([]);
        setDeleteLoading(false);
    }

    function isSelected(file: FileObject) {
        const selectedIds = selectedFiles.map((file) => file.id);
        return selectedIds.includes(file.id);
    }

    function handleSelection(file: FileObject) {
        const currentSelectedArray = [...selectedFiles];
        if (isSelected(file)) {
            const newSelectedArray = currentSelectedArray.filter(
                (selectedFile) => selectedFile.id !== file.id,
            );
            setSelectedFiles(newSelectedArray);
        } else {
            currentSelectedArray.push(file);
            setSelectedFiles(currentSelectedArray);
        }
    }
    return (
        <>
            {data === "loading" ? (
                <LoadingSpinner />
            ) : data?.error ? (
                <PostgrestErrorDisplay error={data.error} />
            ) : (
                <div className="flex w-full justify-center flex-wrap">
                    <div className="grid gap-2 w-full grid-cols-1 @max-sm:grid-cols-1 @sm:grid-cols-2 @md:grid-cols-3 @xl:grid-cols-4 @3xl:grid-cols-6 p-4 justify-center">
                        {(data?.data || []).map((image, index) => (
                            <ImageGridItem
                                key={index}
                                image={image}
                                textDocumentFolderPath={textDocumentFolderPath}
                                isSelected={isSelected(image)}
                                onSelect={handleSelection}
                            />
                        ))}
                        <UploadImageItem
                            textDocumentFolderPath={textDocumentFolderPath}
                            onSuccess={handleGetImages}
                        />
                    </div>
                    {selectedFiles.length > 0 && (
                        <Button
                            variant="destructive"
                            type="button"
                            onClick={handleDeleteSelected}
                            className="transition-all ease-in-out"
                        >
                            {isDeleteLoading ? (
                                <LoadingSpinner />
                            ) : (
                                `Delete ${selectedFiles.length} selected`
                            )}
                        </Button>
                    )}
                </div>
            )}
        </>
    );
}
