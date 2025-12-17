import {
    Card,
    CardAction,
    CardContent,
    CardHeader,
} from "@/components/ui/card";
import { Group, Transaction } from "../types";
import { ComponentProps } from "react";
import { createClient } from "@/utils/supabase/server";
import { Badge } from "@/components/ui/badge";
import TransactionsDisplay from "./transaction";
import NewElement from "@/components/accountant/actions/new-element-button";
import TransactionForm from "@/components/accountant/actions/transaction-form";
import PostgrestErrorDisplay from "@/components/ui/postgrest-error-display";
import { SupabaseResponse } from "@/utils/supabase/types";

const defaultTransaction: (groupId: string, userId: string) => Transaction = (
    groupId,
    userId
) => ({
    id: "",
    paid_by_id: userId,
    description: "",
    currency_iso_code: "PLN",
    amount: 0,
    group_id: groupId,
    split_type: "equal",
});

export default async function GroupTransactionTable({
    group,
    ...props
}: { group: Group } & ComponentProps<"div">) {
    const supabase = await createClient();
    const { data, error } = (await supabase
        .from("transaction")
        .select(
            "id,description,paid_by_id,currency_iso_code,amount,group_id,split_type,created_at,paid_by:group_member!transaction_paid_by_fkey(id,nickname,user:UserInfo(firstName,lastName,avatarUrl,userId)),splits:transaction_split(transaction_id,group_id,borrower_id,created_at,amount)"
        )
        .eq("group_id", group.id)
        .order("created_at", {
            ascending: false,
        })) as SupabaseResponse<Transaction>;
    const { user } = (await supabase.auth.getUser()).data;
    const currentUserMember = (group?.members || []).find(
        (member) => member.user_id === user?.id
    );
    return (
        <Card {...props}>
            <CardHeader>
                <div className="flex flex-row gap-2">
                    <h4>Transactions</h4>
                    <p className="flex items-center">
                        <Badge variant="outline" className="aspect-square">
                            {data?.length || 0}
                        </Badge>
                    </p>
                </div>
                <CardAction>
                    {user && (
                        <NewElement
                            buttonLabel="New Transaction"
                            dialogTitle="New Transaction"
                            FormComponent={TransactionForm}
                            formProps={{
                                data: defaultTransaction(
                                    group.id,
                                    currentUserMember?.id || ""
                                ),
                                groupMembers: group?.members || [],
                            }}
                        />
                    )}
                </CardAction>
            </CardHeader>
            <CardContent className="max-h-[400px] overflow-scroll">
                {data && (
                    <TransactionsDisplay
                        transactions={data || []}
                        group={group}
                        groupMembers={group.members || []}
                    />
                )}
                {error && <PostgrestErrorDisplay error={error} />}
            </CardContent>
        </Card>
    );
}
