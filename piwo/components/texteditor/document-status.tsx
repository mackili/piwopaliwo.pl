import { Controller, Control } from "react-hook-form";
import {
    Select,
    SelectContent,
    SelectTrigger,
    SelectItem,
    SelectValue,
} from "../ui/select";
import { DocumentStatusEnum, TextDocument } from "./types";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";

export default function StatusDropdown({
    control,
    onStatusChange,
}: {
    control: Control<TextDocument>;
    onStatusChange: () => void;
}) {
    return (
        <Controller
            control={control}
            name="status"
            render={({ field }) => (
                <div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button type="button" variant="outline">
                                {field.value?.toUpperCase()}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {DocumentStatusEnum.options.map((status, key) => (
                                <DropdownMenuItem
                                    key={key}
                                    onSelect={() => {
                                        field.onChange(status);
                                        onStatusChange();
                                    }}
                                    disabled={status === field.value}
                                >
                                    {status?.toUpperCase()}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )}
        />
    );
}
