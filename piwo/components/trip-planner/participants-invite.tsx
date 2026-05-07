"use client";

import { Tables } from "@/database.types";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ComponentProps } from "react";
import { UserRoundPlusIcon } from "lucide-react";

export default function TripParticipantsInvite({
    trip,
    ...props
}: { trip: Tables<"v_trip_details"> } & ComponentProps<"button">) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="secondary" {...props}>
                    <UserRoundPlusIcon /> Invite
                </Button>
            </DialogTrigger>
        </Dialog>
    );
}
