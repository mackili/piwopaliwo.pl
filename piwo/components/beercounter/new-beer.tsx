"use client";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import BeerForm from "./beer-form";
import { User } from "@supabase/supabase-js";
import { useI18n } from "@/locales/client";
import { useState } from "react";

export default function NewBeer({ user }: { user: User }) {
    const t = useI18n();
    const [isOpen, setOpen] = useState<boolean>(false);
    return (
        <Dialog open={isOpen} onOpenChange={() => isOpen && setOpen(false)}>
            <DialogTrigger asChild>
                <Button size="lg" onClick={() => setOpen(true)}>
                    {t("BeerCounter.newBeer")}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t("BeerCounter.newBeer")}</DialogTitle>
                    <DialogDescription>
                        {t("BeerCounter.newBeerDescription")}
                    </DialogDescription>
                </DialogHeader>
                <BeerForm userData={user} onSubmit={setOpen} />
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="ghost" onClick={() => setOpen(false)}>
                            {t("BeerCounter.cancel")}
                        </Button>
                    </DialogClose>
                    <Button type="submit" form="new-beer-form">
                        {t("BeerCounter.saveBeer")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
