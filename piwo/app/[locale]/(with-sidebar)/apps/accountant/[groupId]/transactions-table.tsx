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
import { PostgrestError } from "@supabase/supabase-js";
import ErrorMessage from "@/components/ui/error-message";
import TransactionsDisplay from "./transaction";
import NewElement from "../(components)/(actions)/new-element-button";
// import { v4 as uuid } from "uuid";
import TransactionForm from "../(components)/(actions)/transaction-form";

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
});

export default async function GroupTransactionTable({
    group,
    ...props
}: { group: Group } & ComponentProps<"div">) {
    const supabase = await createClient();
    const { data, error } = (await supabase
        .from("transaction")
        .select(
            "id,description,paid_by_id,currency_iso_code,amount,group_id,created_at,paid_by:group_member!transaction_paid_by_fkey(id,nickname,user:UserInfo(firstName,lastName,avatarUrl,userId))"
        )
        .eq("group_id", group.id)) as {
        data: Transaction[] | null;
        error: PostgrestError | null;
    };
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
            <CardContent>
                {error ? (
                    <ErrorMessage error={`${error.code}: ${error.details}`} />
                ) : (
                    <TransactionsDisplay
                        transactions={data || []}
                        group={group}
                    />
                )}
            </CardContent>
        </Card>
    );
}
