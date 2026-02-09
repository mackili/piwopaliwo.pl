"use client";

import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "../ui/button";
import ImageDrawerGrid from "./image-drawer-grid";
import { CameraIcon } from "lucide-react";
import { useI18n } from "@/locales/client";

export default function MarkdownImageDrawer({
    textDocumentId,
}: {
    textDocumentId: string;
}) {
    const t = useI18n();
    return (
        <Drawer>
            <DrawerTrigger asChild>
                <div className="fixed inset-x-0 flex w-full justify-center bottom-5">
                    <Button variant="secondary">
                        <CameraIcon /> {t("TextEditor.images")}
                    </Button>
                </div>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>{t("TextEditor.images")}</DrawerTitle>
                </DrawerHeader>
                <div className="w-full flex justify-center @container">
                    <ImageDrawerGrid textDocumentId={textDocumentId} />
                </div>
            </DrawerContent>
        </Drawer>
    );
}
