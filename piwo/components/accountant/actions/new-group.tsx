"use client";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    // DialogClose,
    DialogContent,
    DialogDescription,
    // DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Group } from "../../../app/[locale]/(with-sidebar)/apps/accountant/types";
import { v4 as uuid } from "uuid";
import { User } from "@supabase/supabase-js";
import GroupForm from "./group-form";

const generateNewGroup: (userId: string) => Group = (userId) => ({
    id: uuid(),
    owner_id: userId,
    name: "",
    description: "",
    thumbnail_url: null,
    currencies: [],
});

export default function NewGroupButton({ user }: { user: User }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default">New Group</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>New Group Creator</DialogTitle>
                    <DialogDescription>
                        Enter the details about your new Accountant group
                    </DialogDescription>
                </DialogHeader>
                <GroupForm groupData={generateNewGroup(user.id)} />
            </DialogContent>
        </Dialog>
    );
}
