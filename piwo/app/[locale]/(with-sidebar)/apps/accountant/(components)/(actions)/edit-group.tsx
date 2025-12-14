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
import { Group } from "../../types";
import { User } from "@supabase/supabase-js";
import GroupForm from "./group-form";
import { VariantProps } from "class-variance-authority";

export default function EditGroupButton({
    user,
    group,
    variant = "default",
}: {
    user: User;
    group: Group;
} & VariantProps<typeof buttonVariants>) {
    if (Object.keys(group).includes("members")) delete group.members;
    if (Object.keys(group).includes("owner")) delete group.owner;
    return user.id === group.owner_id ? (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={variant}>Edit Group</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>New Group Creator</DialogTitle>
                    <DialogDescription>
                        Enter the details about your new Accountant group
                    </DialogDescription>
                </DialogHeader>
                <GroupForm groupData={group} />
            </DialogContent>
        </Dialog>
    ) : (
        <></>
    );
}
