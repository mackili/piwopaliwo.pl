"use client";
import { ComponentProps, useMemo } from "react";
import { Group, GroupMember, Transaction } from "../types";
import { DataTable } from "@/components/ui/datatable";
import { ColumnDef } from "@tanstack/react-table";
import { UserAvatar } from "@/components/user-avatar";
import { DataTableColumnHeader } from "@/components/ui/datatable-header";
import NewElementButton from "../(components)/(actions)/new-element-button";
import TransactionForm from "../(components)/(actions)/transaction-form";

export default function TransactionsDisplay({
    transactions,
    group,
    ...props
}: { transactions: Transaction[]; group: Group } & ComponentProps<"table">) {
    console.log("Rendering transactions table");
    const columns: ColumnDef<Transaction>[] = useMemo(
        () => [
            {
                enableHiding: false,
                accessorKey: "description",
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={{ ...column }}
                        title="Description"
                    />
                ),
            },
            {
                enableHiding: false,
                accessorKey: "amount",
                header: ({ column }) => (
                    <DataTableColumnHeader column={column} title="Amount" />
                ),
            },
            {
                enableHiding: false,
                accessorKey: "currency_iso_code",
                header: ({ column }) => (
                    <DataTableColumnHeader column={column} title="Currency" />
                ),
            },
            {
                enableHiding: false,
                accessorKey: "paid_by",
                header: ({ column }) => (
                    <DataTableColumnHeader column={column} title="Paid By" />
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
                    <NewElementButton
                        buttonLabel={"Edit"}
                        dialogTitle={`Edit ${row.getValue("description")}`}
                        formProps={{
                            data: row.original,
                            groupMembers: group.members,
                        }}
                        FormComponent={TransactionForm}
                        variant="outline"
                    />
                ),
            },
        ],
        [group.members]
    );
    return <DataTable columns={columns} data={transactions} {...props} />;
}
