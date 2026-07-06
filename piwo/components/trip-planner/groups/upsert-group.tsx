"use client";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormLabel } from "@/components/ui/form";
import FormInput from "@/components/ui/form-input";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { publicGroupInsertSchema } from "@/database.schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    EditIcon,
    MinusIcon,
    PlusIcon,
    SaveIcon,
    Trash2Icon,
} from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import z from "zod";
import { useState } from "react";
import { PostgrestError } from "@supabase/supabase-js";
import PostgrestErrorDisplay from "@/components/ui/postgrest-error-display";
import { useI18n } from "@/locales/client";
import { Tables } from "@/database.types";
import {
    GroupCurrency,
    GroupCurrencySchema,
} from "@/app/[locale]/(with-sidebar)/apps/accountant/types";
import { upsertGroup } from "../fetch";
import { useRouter } from "next/navigation";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const groupObjectSchema = publicGroupInsertSchema.extend({
    currencies: z.array(GroupCurrencySchema),
});

export default function UpsertGroup({
    group,
    userId,
    variant = "create",
}: {
    variant: "create" | "edit";
    group?: Tables<"group">;
    userId: string;
}) {
    console.log(variant);
    const router = useRouter();
    const t = useI18n();
    const [saveError, setSaveError] = useState<PostgrestError | null>();
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const form = useForm<z.infer<typeof groupObjectSchema>>({
        resolver: zodResolver(groupObjectSchema),
        values: {
            ...group,
            name: group?.name || "",
            currencies: (group?.currencies as GroupCurrency[] | null) || [
                { iso: "PLN", primary: true, rate: 1 },
            ],
            owner_id: group?.owner_id || userId,
        },
    });
    const {
        fields: currencies,
        append,
        remove,
    } = useFieldArray({
        control: form.control,
        name: "currencies",
    });
    const handleSubmit = async (
        formData: z.infer<typeof publicGroupInsertSchema>,
    ) => {
        const { data, error } = await upsertGroup(formData);
        setSaveError(error);
        if (data) {
            router.refresh();
            setDialogOpen(false);
        }
    };
    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                {variant === "create" ? (
                    <Button
                        variant="outline"
                        type="button"
                        className="border-dashed hover:bg-muted min-h-32 h-full"
                    >
                        <PlusIcon />
                    </Button>
                ) : (
                    <Button
                        variant="secondary"
                        type="button"
                        className="hover:bg-muted"
                        size="icon"
                    >
                        <EditIcon />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="overflow-auto">
                <DialogTitle>
                    {variant === "create"
                        ? t("Accountant.newGroup")
                        : `${t("edit")} ${group?.name}`}
                </DialogTitle>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        id="edit-accommodation-unit-form"
                    >
                        <div className="space-y-4">
                            <FormInput
                                name="name"
                                label={t("Accountant.groupName")}
                                form={form}
                            />
                            <FormInput
                                name="description"
                                label={t("Accountant.description")}
                                form={form}
                            />
                            <div className="space-y-2">
                                <p className="font-semibold uppercase text-lg">
                                    {t("Accountant.currencies")}
                                </p>
                                {currencies.map((currency, index) => (
                                    <Card key={index}>
                                        <CardContent className="space-y-2">
                                            <p className="font-semibold uppercase">
                                                {form.watch(
                                                    `currencies.${index}.iso`,
                                                )}
                                            </p>
                                            <FormInput
                                                name={`currencies.${index}.iso`}
                                                label={t(
                                                    "Accountant.currencyCode",
                                                )}
                                                type="text"
                                                form={form}
                                            />
                                            <FormInput
                                                name={`currencies.${index}.primary`}
                                                label={t("Accountant.primary")}
                                                type="checkbox"
                                                form={form}
                                            />
                                            {form.watch(
                                                `currencies.${index}.primary`,
                                            ) === false && (
                                                <FormInput
                                                    name={`currencies.${index}.rate`}
                                                    label={t(
                                                        "Accountant.currencyRate",
                                                    )}
                                                    type="number"
                                                    form={form}
                                                />
                                            )}
                                        </CardContent>
                                        {currencies.length > 1 && (
                                            <CardFooter>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => {
                                                        remove(index);
                                                    }}
                                                >
                                                    <Trash2Icon />
                                                </Button>
                                            </CardFooter>
                                        )}
                                    </Card>
                                ))}
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => {
                                        append({
                                            iso: "",
                                            primary: false,
                                            rate: 1,
                                        });
                                    }}
                                >
                                    <PlusIcon /> {t("add")}
                                </Button>
                            </div>
                        </div>
                    </form>
                    <PostgrestErrorDisplay error={saveError} />
                </Form>
                <DialogFooter>
                    <Button
                        type="submit"
                        form="edit-accommodation-unit-form"
                        disabled={form.formState.isSubmitting}
                    >
                        {form.formState.isSubmitting ? (
                            <LoadingSpinner />
                        ) : (
                            <>
                                <SaveIcon /> {t("Blog.save")}
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
