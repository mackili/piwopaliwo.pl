"use client";
import {
    Card,
    CardAction,
    CardContent,
    CardHeader,
} from "@/components/ui/card";
import { Group, GroupCurrency } from "../types";
import { ComponentProps, useMemo } from "react";
import NewElementButton from "../(components)/(actions)/new-element-button";
import GroupCurrenciesForm from "../(components)/(actions)/currencies-form";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/datatable-header";
import { DataTable } from "@/components/ui/datatable";
import { Checkbox } from "@/components/ui/checkbox";

export default function GroupCurrenciesTable({
    group,
    ...props
}: { group: Group } & ComponentProps<"div">) {
    const columns: ColumnDef<GroupCurrency>[] = useMemo(
        () => [
            {
                enableHiding: false,
                accessorKey: "iso",
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={{ ...column }}
                        title="Description"
                    />
                ),
            },
            {
                enableHiding: false,
                accessorKey: "rate",
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={{ ...column }}
                        title="Rate"
                    />
                ),
            },
            {
                enableHiding: false,
                accessorKey: "primary",
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={{ ...column }}
                        title="Primary"
                    />
                ),
                cell: ({ row }) => (
                    <Checkbox disabled checked={row.getValue("primary")} />
                ),
            },
        ],
        []
    );
    return (
        <Card {...props}>
            <CardHeader>
                <h4>Currencies</h4>
                <CardAction>
                    <NewElementButton
                        buttonLabel="Manage"
                        dialogTitle="Manage Currencies"
                        FormComponent={GroupCurrenciesForm}
                        formProps={{ data: group }}
                    />
                </CardAction>
            </CardHeader>
            <CardContent>
                {/* <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Currency</TableHead>
                            <TableHead>Rate</TableHead>
                            <TableHead className="w-6">Is Primary</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {(group?.currencies || []).map((currency) => (
                            <TableRow key={currency.iso}>
                                <TableCell>{currency.iso}</TableCell>
                                <TableCell>{currency.rate}</TableCell>
                                <TableCell>
                                    <Checkbox
                                        disabled
                                        checked={currency.primary}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table> */}
                <DataTable columns={columns} data={group?.currencies || []} />
            </CardContent>
        </Card>
    );
}
