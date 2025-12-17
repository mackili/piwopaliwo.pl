"use client";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import {
    Group,
    GroupSchema,
} from "../../../app/[locale]/(with-sidebar)/apps/accountant/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import ErrorMessage from "@/components/ui/error-message";
import { ComponentProps, useActionState } from "react";
import { twMerge } from "tailwind-merge";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import Image from "next/image";
import { CameraOff } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ChangeEvent, useState } from "react";
import { upsertGroup } from "./upsert-group";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useRouter } from "next/navigation";
import { useCurrentLocale, useI18n } from "@/locales/client";
import { upsertThumbnail } from "./upsert-thumbnail";
import PostgrestErrorDisplay from "@/components/ui/postgrest-error-display";

export function getImageData(event: ChangeEvent<HTMLInputElement>) {
    // FileList is immutable, so we need to create a new one
    const dataTransfer = new DataTransfer();

    // Add newly uploaded images
    Array.from(event.target.files!).forEach((image) =>
        dataTransfer.items.add(image)
    );

    const files = dataTransfer.files;
    const displayUrl = URL.createObjectURL(event.target.files![0]);

    return { files, displayUrl };
}

export default function GroupForm({
    groupData,
    ...props
}: {
    groupData: Group;
} & ComponentProps<"form">) {
    const t = useI18n();
    const router = useRouter();
    const locale = useCurrentLocale();
    const [result, handleSubmit, isPending] = useActionState(
        handleGroupSave,
        null
    );
    const form = useForm<Group>({
        resolver: zodResolver(GroupSchema),
        defaultValues: groupData,
    });
    const [thumbnailData, setThumbnailData] = useState<{
        thumbnailUrl: null | string;
        file: File | null;
    }>({
        thumbnailUrl: form.getValues("thumbnail_url"),
        file: null,
    });
    const handleImageDraftSave = (event: ChangeEvent<HTMLInputElement>) => {
        const { files, displayUrl } = getImageData(event);
        setThumbnailData({ thumbnailUrl: displayUrl, file: files[0] });
    };

    async function handleGroupSave() {
        form.trigger();
        if (!form.formState.isValid) {
            return;
        }
        if (thumbnailData.file) {
            const thumbnail = await upsertThumbnail(
                thumbnailData.file,
                form.getValues("id")
            );
            if (thumbnail.error) {
                return thumbnail.error;
            } else {
                form.setValue("thumbnail_url", thumbnail.data.publicUrl);
            }
        }
        const result = await upsertGroup(form.getValues());
        if (result.data) {
            router.push(`/${locale}/apps/accountant/${result.data[0].id}`);
        } else {
            return result.error;
        }
    }
    return (
        <Form {...form}>
            <form
                action={handleSubmit}
                className={twMerge("grid gap-4", props?.className)}
                {...props}
            >
                <Card
                    id="thumbnail-preview"
                    className="w-full aspect-3/1 flex items-center justify-center bg-accent p-0"
                >
                    {thumbnailData.thumbnailUrl ? (
                        <Image
                            src={thumbnailData.thumbnailUrl}
                            alt="Thumbnail"
                            className="w-full h-full object-cover rounded-xl"
                            width={128}
                            height={128}
                        />
                    ) : (
                        <CameraOff />
                    )}
                </Card>
                <FormItem>
                    <FormLabel>{t("Accountant.groupThumbnail")}</FormLabel>
                    <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageDraftSave}
                    />
                </FormItem>
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field, fieldState }) => (
                        <FormItem>
                            <FormLabel>{t("Accountant.groupName")}</FormLabel>
                            <Input type="text" {...field} />
                            {fieldState.invalid && (
                                <ErrorMessage
                                    error={fieldState?.error?.message || ""}
                                />
                            )}
                        </FormItem>
                    )}
                />
                <PostgrestErrorDisplay error={result} />
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            {t("BeerCounter.cancel")}
                        </Button>
                    </DialogClose>
                    <Button disabled={isPending} type="submit">
                        {isPending ? <LoadingSpinner /> : t("submit")}
                    </Button>
                </DialogFooter>
            </form>
        </Form>
    );
}
