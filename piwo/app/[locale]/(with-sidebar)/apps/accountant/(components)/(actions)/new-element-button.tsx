"use client";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useState, ElementType } from "react";
import { VariantProps } from "class-variance-authority";

type NewElementButtonProps<FormProps> = {
    dialogTitle: string;
    buttonLabel: string;
    FormComponent: ElementType;
    formProps: FormProps;
};

export default function NewElementButton<FormProps>({
    dialogTitle,
    buttonLabel,
    FormComponent,
    formProps,
    ...props
}: NewElementButtonProps<FormProps> & VariantProps<typeof buttonVariants>) {
    const [isOpen, setOpen] = useState<boolean>(false);
    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size={props.size || "sm"} {...props}>
                    {buttonLabel}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>{dialogTitle}</DialogTitle>
                <FormComponent {...formProps} setDialogOpen={setOpen} />
            </DialogContent>
        </Dialog>
    );
}
