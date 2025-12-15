import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getCurrentLocale } from "@/locales/server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { GroupInviteView } from "../types";
import PostgrestErrorDisplay from "@/components/ui/postgrest-error-display";
import { SupabaseResponse } from "@/utils/supabase/types";
import InvitationAcceptForm from "./invitation-accept-form";

export default async function Invite({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    function redirectToMainAccountant() {
        redirect(`/${locale}/apps/accountant`);
    }
    const localePromise = getCurrentLocale();
    const [locale, query, supabase] = await Promise.all([
        localePromise,
        searchParams,
        createClient(),
    ]);
    const [groupId, groupMemberId] = [query?.gid, query?.gmid];
    if (!groupId || !groupMemberId) {
        redirectToMainAccountant();
    }
    const userId = (await supabase.auth.getUser())?.data?.user?.id;
    const { data, error } = (await supabase
        .from("v_group_invitation")
        .select()
        .eq("group_id", groupId)
        .eq("group_member_id", groupMemberId)
        .eq("user_id", userId)
        .limit(1)) as SupabaseResponse<GroupInviteView>;
    const invitation = data ? data[0] : null;
    if (invitation?.accepted_at) {
        redirect(`/${locale}/apps/accountant/${invitation.group_id}`);
    }
    return (
        <div className="w-full h-full flex justify-center items-center">
            <Card className="min-w-[300px] min-h-[200px]">
                {invitation && userId && (
                    <>
                        <CardHeader>
                            <h3>{`Invitation to ${invitation?.group?.name}`}</h3>
                        </CardHeader>
                        <CardContent>{`You have been invited to join the group ${invitation.group?.name} as ${invitation.group_member?.nickname}.`}</CardContent>
                        <InvitationAcceptForm
                            invitation={invitation}
                            userId={userId}
                        />
                    </>
                )}
                <PostgrestErrorDisplay error={error} />
            </Card>
        </div>
    );
}
