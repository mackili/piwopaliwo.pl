"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Group } from "../../../app/[locale]/(with-sidebar)/apps/accountant/types";
import { User } from "@supabase/supabase-js";
import GroupForm from "./group-form";
import { VariantProps } from "class-variance-authority";
import { useI18n } from "@/locales/client";

export default function EditGroupButton({
    user,
    group,
    variant = "default",
}: {
    user: User;
    group: Group;
} & VariantProps<typeof buttonVariants>) {
    const t = useI18n();
    if (Object.keys(group).includes("members")) delete group.members;
    if (Object.keys(group).includes("owner")) delete group.owner;
    return user.id === group.owner_id ? (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={variant}>{t("edit")}</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t("edit")}</DialogTitle>
                    <DialogDescription>
                        {t("Accountant.createNewGroupEnterDetails")}
                    </DialogDescription>
                </DialogHeader>
                <GroupForm groupData={group} />
            </DialogContent>
        </Dialog>
    ) : (
        <></>
    );
}
