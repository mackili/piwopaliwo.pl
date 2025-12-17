import { createClient } from "@/utils/supabase/server";
import { Card, CardContent, CardHeader } from "../ui/card";
import InvitationAcceptForm from "@/app/[locale]/(with-sidebar)/apps/accountant/invitation/invitation-accept-form";
import { SupabaseResponse } from "@/utils/supabase/types";
import { GroupInviteView } from "@/app/[locale]/(with-sidebar)/apps/accountant/types";
import PostgrestErrorDisplay from "../ui/postgrest-error-display";
import { ComponentProps } from "react";
import { getI18n } from "@/locales/server";

const GROUP_INVITE_VIEW = "v_group_invitation";

export default async function GroupsInvitations({
    ...props
}: ComponentProps<"div">) {
    const t = await getI18n();
    const supabase = await createClient();
    const { data: user, error: userError } = await supabase.auth.getUser();
    const { data: invitations, error: invitationsError } = user?.user?.id
        ? await supabase
              .from(GROUP_INVITE_VIEW)
              .select()
              .eq("user_id", user.user.id)
              .is("accepted_at", null)
        : ({ data: null, error: null } as SupabaseResponse<GroupInviteView>);
    return (
        <Card {...props}>
            <CardHeader>
                <h3>{t("Accountant.pendingInvitations")}</h3>
            </CardHeader>
            <CardContent className="max-h-full overflow-y-scroll">
                {invitations &&
                    user?.user &&
                    invitations.map((invite, index) => (
                        <Card key={index}>
                            <CardHeader>
                                <h4>{invite?.group?.name}</h4>
                            </CardHeader>
                            {invite?.group?.name &&
                                invite?.group_member?.nickname && (
                                    <CardContent>
                                        {`${t(
                                            "Accountant.youHaveBeenInvited"
                                        )}} ${invite.group?.name} ${t("as")} ${
                                            invite.group_member?.nickname
                                        }
                        `}
                                    </CardContent>
                                )}
                            <InvitationAcceptForm
                                invitation={invite}
                                userId={user.user.id}
                                className="w-full gap-2 justify-center"
                            />
                        </Card>
                    ))}
                {invitations && invitations.length === 0 && (
                    <p className="bg-accent p-4 rounded-md italic">
                        {t("Accountant.noInvitationsComm")}
                    </p>
                )}
                {(invitationsError || userError) && (
                    <PostgrestErrorDisplay
                        error={
                            invitationsError || {
                                ...userError,
                                details: "",
                                hint: "",
                                code: String(userError?.code),
                                message: userError?.message || null,
                            }
                        }
                    />
                )}
            </CardContent>
        </Card>
    );
}
