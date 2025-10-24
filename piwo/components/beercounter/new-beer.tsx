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
import { useI18n } from "@/locales/client";

export default function NewBeer() {
    const t = useI18n();
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>{t("BeerCounter.newBeer")}</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t("BeerCounter.newBeer")}</DialogTitle>
                    <DialogDescription>
                        {t("BeerCounter.newBeerDescription")}
                    </DialogDescription>
                </DialogHeader>
                <div></div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="ghost">
                            {t("BeerCounter.cancel")}
                        </Button>
                    </DialogClose>
                    <Button type="submit">{t("BeerCounter.saveBeer")}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
