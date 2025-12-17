"use client";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Group } from "@/app/[locale]/(with-sidebar)/apps/accountant/types";
import { v4 as uuid } from "uuid";
import { User } from "@supabase/supabase-js";
import GroupForm from "./group-form";
import { useI18n } from "@/locales/client";

const generateNewGroup: (userId: string) => Group = (userId) => ({
    id: uuid(),
    owner_id: userId,
    name: "",
    description: "",
    thumbnail_url: null,
    currencies: [],
});

export default function NewGroupButton({ user }: { user: User }) {
    const t = useI18n();
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default">{t("Accountant.newGroup")}</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t("Accountant.createNewGroup")}</DialogTitle>
                    <DialogDescription>
                        {t("Accountant.createNewGroupEnterDetails")}
                    </DialogDescription>
                </DialogHeader>
                <GroupForm groupData={generateNewGroup(user.id)} />
            </DialogContent>
        </Dialog>
    );
}
