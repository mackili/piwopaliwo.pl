"use client";

import { Constants, Enums, Tables, TablesInsert } from "@/database.types";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ComponentProps, useEffect, useReducer, useState } from "react";
import { SaveIcon, Trash2Icon, UserRoundPlusIcon } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useFieldArray, useForm } from "react-hook-form";
import z from "zod";
import { publicTripParticipantInsertSchema } from "@/database.schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { inviteParticipants, ParticipantResponseJson } from "../fetch";
import { Form } from "@/components/ui/form";
import {
    Card,
    CardAction,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import FormInput from "@/components/ui/form-input";
import { TripParticipantRoleDisplay } from "./participant-role-picker";
import { TripParticipantAvatar } from "./participant-avatars";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { toast } from "sonner";
import PostgrestErrorDisplay from "@/components/ui/postgrest-error-display";
import { useRouter } from "next/navigation";
import { useI18n } from "@/locales/client";

const formObject = z.object({
    participants: z.array(publicTripParticipantInsertSchema),
});
type GroupMemberFetch =
    | {
          added_at: string | null;
          assigned_at: string | null;
          group_id: string;
          id: string;
          nickname: string;
          removed_at: string | null;
          status: Enums<"acc_group_user_status"> | null;
          user_id: string | null;
          user: {
              first_name: string | null;
              id: string;
              last_name: string | null;
              avatar_url: string | null;
          } | null;
      }[]
    | null;

const PARTICIPANT_ROLES = Constants.permissions.Enums.user_role;

enum GroupMembersActionType {
    FETCH = "FETCH",
    ADD = "ADD",
    REMOVE = "REMOVE",
}

interface GroupMembersAction {
    type: GroupMembersActionType;
    payload: GroupMemberFetch;
}

function availableGroupMembersReducer(
    state: GroupMemberFetch,
    action: GroupMembersAction,
) {
    let result = state;
    switch (action.type) {
        case GroupMembersActionType.FETCH:
            result = action.payload;
            break;
        case GroupMembersActionType.ADD:
            // Remove the selected member from the available pool
            result =
                state?.filter(
                    (member) =>
                        !(action.payload || [])
                            .map((item) => item.id)
                            .includes(member.id),
                ) || [];
            break;
        case GroupMembersActionType.REMOVE:
            // Add the removed member back to the available pool
            result = [...(state || []), ...(action.payload || [])];
            break;
        default:
            break;
    }
    return result;
}

export default function TripParticipantsInvite({
    trip,
    showTextOnButton = true,
    ...props
}: {
    trip: Tables<"v_trip_details">;
    showTextOnButton?: boolean;
} & ComponentProps<"button">) {
    const router = useRouter();
    const t = useI18n();
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [availableGroupMembers, setAvailableGroupMembers] = useReducer(
        availableGroupMembersReducer,
        [],
    );
    const defaultMember: TablesInsert<"trip_participant"> = {
        trip_id: trip.id as string,
        role: "viewer",
        group_member_id: "",
    };
    useEffect(() => {
        const supabase = createClient();
        const fetchGroupMembers = async () => {
            if (trip?.group_id) {
                const { data, error } = await supabase
                    .from("group_member")
                    .select(
                        "*,user:UserInfo(first_name:firstName,id:userId,last_name:lastName,avatar_url:avatarUrl)",
                    )
                    .eq("group_id", trip.group_id)
                    .or("status.neq.rejected,status.is.null")
                    .not(
                        "id",
                        "in",
                        `(${(trip.participants as ParticipantResponseJson[])
                            .map((participant) => participant.group_member.id)
                            .join(",")})`,
                    )
                    .is("removed_at", null);
                if (error) {
                    toast(
                        t("TripPlanner.participants.failedToFetchGroupMembers"),
                        {
                            description: (
                                <PostgrestErrorDisplay error={error} />
                            ),
                            position: "bottom-center",
                        },
                    );
                    setDialogOpen(false);
                    return;
                }
                if (data) {
                    setAvailableGroupMembers({
                        type: GroupMembersActionType.FETCH,
                        payload: data,
                    });
                }
            }
        };
        fetchGroupMembers();
    }, [trip?.group_id, trip?.participants]);
    const form = useForm<z.infer<typeof formObject>>({
        resolver: zodResolver(formObject),
        defaultValues: {
            participants: [defaultMember],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "participants",
    });

    async function handleSubmit(values: z.infer<typeof formObject>) {
        const { error } = await inviteParticipants(values.participants);
        if (error) {
            toast(t("failedToSaveToDatabase"), {
                description: <PostgrestErrorDisplay error={error} />,
                position: "bottom-center",
            });
            return;
        }
        toast(t("TripPlanner.participants.participantsInvitedSuccessfully"), {
            position: "bottom-center",
        });
        form.reset();
        router.refresh();
        setDialogOpen(false);
    }

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="secondary" {...props}>
                    <UserRoundPlusIcon />
                    {showTextOnButton &&
                        ` ${t("TripPlanner.participants.invite")}`}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>
                    {t("TripPlanner.participants.inviteGroupMembers")}
                </DialogTitle>
                <Form {...form}>
                    <form
                        id="edit-participants-form"
                        onSubmit={form.handleSubmit(handleSubmit)}
                    >
                        <div className="space-y-4">
                            {fields.map((field, index) => (
                                <Card key={index}>
                                    <CardContent className="space-y-4">
                                        <FormInput
                                            name={`participants.${index}.group_member_id`}
                                            form={form}
                                            type="select"
                                            label={t("Accountant.addMember")}
                                            options={availableGroupMembers?.map(
                                                (member) => ({
                                                    value: member.id,
                                                    label: (
                                                        <>
                                                            <TripParticipantAvatar
                                                                participant={{
                                                                    id: "",
                                                                    status: "invited",
                                                                    role: "viewer",
                                                                    group_member:
                                                                        {
                                                                            ...member,
                                                                            status: "invited",
                                                                        },
                                                                    user: member?.user,
                                                                }}
                                                                avatarSize="sm"
                                                            />
                                                            {member.nickname}
                                                        </>
                                                    ),
                                                }),
                                            )}
                                        />
                                        <FormInput
                                            name={`participants.${index}.role`}
                                            form={form}
                                            type="select"
                                            label={t("role")}
                                            options={PARTICIPANT_ROLES.map(
                                                (role) => ({
                                                    value: role,
                                                    label: TripParticipantRoleDisplay(
                                                        {
                                                            role: role,
                                                            roleDisplay: t(
                                                                `TripPlanner.roles.${role}`,
                                                            ),
                                                        },
                                                    ),
                                                }),
                                            )}
                                        />
                                    </CardContent>
                                    <CardFooter>
                                        <CardAction>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                onClick={() => remove(index)}
                                                aria-label={`${t("TripPlanner.participants.removeParticipant")} ${index + 1}`}
                                            >
                                                <Trash2Icon />
                                            </Button>
                                        </CardAction>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </form>
                </Form>
                <DialogFooter>
                    <Button
                        variant="secondary"
                        type="button"
                        onClick={() => append(defaultMember)}
                    >
                        <UserRoundPlusIcon />
                        Add Participant
                    </Button>
                    <Button
                        variant="default"
                        type="submit"
                        form="edit-participants-form"
                        disabled={form.formState.isSubmitting}
                    >
                        {form.formState.isSubmitting ? (
                            <LoadingSpinner />
                        ) : (
                            <>
                                <SaveIcon />
                                {t("Blog.save")}
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
