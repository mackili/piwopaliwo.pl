"use client";
import { ComponentProps, useMemo } from "react";
import { Group, GroupMember, Transaction } from "../types";
import { DataTable } from "@/components/ui/datatable";
import { ColumnDef } from "@tanstack/react-table";
import { UserAvatar } from "@/components/user-avatar";
import { DataTableColumnHeader } from "@/components/ui/datatable-header";
import NewElementButton from "@/components/accountant/actions/new-element-button";
import TransactionForm from "@/components/accountant/actions/transaction-form";
import { useI18n } from "@/locales/client";
import RemoveTransactionButton from "@/components/accountant/actions/remove-transaction-button";

export default function TransactionsDisplay({
    transactions,
    // group,
    groupMembers,
    ...props
}: {
    transactions: Transaction[];
    group: Group;
    groupMembers: GroupMember[];
} & ComponentProps<"table">) {
    const t = useI18n();
    const columns: ColumnDef<Transaction>[] = useMemo(
        () => [
            {
                enableHiding: false,
                accessorKey: "description",
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={{ ...column }}
                        title={t("Accountant.description")}
                    />
                ),
            },
            {
                enableHiding: false,
                accessorKey: "amount",
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t("Accountant.amount")}
                    />
                ),
            },
            {
                enableHiding: false,
                accessorKey: "currency_iso_code",
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t("Accountant.currency")}
                    />
                ),
            },
            {
                enableHiding: false,
                accessorKey: "paid_by",
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t("Accountant.paidBy")}
                    />
                ),
                cell: ({ row }) => (
                    <div className="flex flex-row gap-2 flex-nowrap items-center">
                        <UserAvatar
                            avatarUrl={
                                (
                                    row.getValue("paid_by") as
                                        | GroupMember
                                        | null
                                        | undefined
                                )?.user?.avatarUrl
                            }
                            name={
                                (
                                    row.getValue("paid_by") as
                                        | GroupMember
                                        | null
                                        | undefined
                                )?.nickname
                            }
                        />
                        <p>
                            {
                                (
                                    row.getValue("paid_by") as
                                        | GroupMember
                                        | null
                                        | undefined
                                )?.nickname
                            }
                        </p>
                    </div>
                ),
                enableSorting: true,
            },
            // {
            //     accessorKey: "created_at",
            //     header: "Date",
            // },
            {
                id: "actions",
                enableHiding: false,
                cell: ({ row }) => (
                    <div className="flex flex-row flex-nowrap gap-2 items-center">
                        <NewElementButton
                            buttonLabel={t("edit")}
                            dialogTitle={`${t("edit")} ${row.getValue(
                                "description"
                            )}`}
                            formProps={{
                                data: row.original,
                                groupMembers: groupMembers,
                            }}
                            FormComponent={TransactionForm}
                            variant="outline"
                        />
                        <RemoveTransactionButton
                            transactionId={row.original.id}
                        />
                    </div>
                ),
            },
        ],
        [groupMembers, t]
    );
    return <DataTable columns={columns} data={transactions} {...props} />;
}
