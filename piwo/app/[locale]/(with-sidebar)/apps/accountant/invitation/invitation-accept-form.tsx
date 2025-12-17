"use client";

import { CardFooter } from "@/components/ui/card";
import { GroupInviteView } from "../types";
import { Button } from "@/components/ui/button";
import { ComponentProps, useState } from "react";
import { acceptInvitation, declineInvitation } from "./fetch";
import { PostgrestError } from "@supabase/supabase-js";
import PostgrestErrorDisplay from "@/components/ui/postgrest-error-display";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useRouter } from "next/navigation";
import { useCurrentLocale, useI18n } from "@/locales/client";
import { twMerge } from "tailwind-merge";

export default function InvitationAcceptForm({
    invitation,
    userId,
    className,
    ...props
}: {
    invitation: GroupInviteView;
    userId: string;
} & ComponentProps<"div">) {
    const t = useI18n();
    const [isPending, setPending] = useState<boolean>(false);
    const [error, setError] = useState<PostgrestError | null>(null);
    const router = useRouter();
    const locale = useCurrentLocale();
    const respondToInvitation = async (accept: boolean | null) => {
        setError(null);
        setPending(true);
        if (accept) {
            const { error: postgrestError } = await acceptInvitation(
                invitation,
                userId
            );
            if (!postgrestError) {
                router.push(
                    `/${locale}/apps/accountant/${invitation.group_id}`
                );
            }
            setError(postgrestError as PostgrestError);
        } else {
            const { error: postgrestError } = await declineInvitation(
                invitation,
                userId
            );
            setError(postgrestError as PostgrestError);
        }
        setPending(false);
    };
    return (
        <CardFooter
            className={twMerge("justify-end-safe gap-4", className)}
            {...props}
        >
            {error && <PostgrestErrorDisplay error={error} />}
            <LoadingSpinner
                className={
                    isPending
                        ? "transition-all ease-in-out"
                        : "transition-all size-0"
                }
            />
            <Button
                variant="outline"
                disabled={isPending}
                onClick={() => respondToInvitation(false)}
            >
                {t("BeerCounter.cancel")}
            </Button>
            <Button
                variant="default"
                disabled={isPending}
                onClick={() => respondToInvitation(true)}
            >
                {t("accept")}
            </Button>
        </CardFooter>
    );
}
