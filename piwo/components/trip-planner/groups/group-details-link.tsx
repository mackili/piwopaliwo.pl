"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCurrentLocale, useI18n } from "@/locales/client";
import { VariantProps } from "class-variance-authority";
import { Users2Icon } from "lucide-react";
import Link from "next/link";

export default function GroupDetailsLink({
    groupId,
    size,
    ...props
}: { groupId: string } & VariantProps<typeof buttonVariants>) {
    const locale = useCurrentLocale();
    const isMobile = useIsMobile();
    const t = useI18n();
    return size === "icon" || isMobile ? (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button {...props} asChild type="button" size={size}>
                    <Link href={`/${locale}/apps/accountant/${groupId}`}>
                        <Users2Icon />
                    </Link>
                </Button>
            </TooltipTrigger>
            <TooltipContent>{t("TripPlanner.goToGroup")}</TooltipContent>
        </Tooltip>
    ) : (
        <Button {...props} asChild type="button" size={size}>
            <Link href={`/${locale}/apps/accountant/${groupId}`}>
                <Users2Icon /> {t("TripPlanner.goToGroup")}
            </Link>
        </Button>
    );
}
