import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { DocumentSectionType, DocumentSectionTypeEnum } from "./types";

export default function SectionTypeDropdown({
    value,
    onChange,
    disabled,
    className,
}: {
    value: DocumentSectionType;
    onChange: (type: DocumentSectionType) => void;
    disabled?: boolean;
    className?: string;
}) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    disabled={disabled}
                    className={className}
                >
                    {value}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {DocumentSectionTypeEnum.options.map((type) => (
                    <DropdownMenuItem
                        key={type}
                        onSelect={() => onChange(type)}
                        disabled={type === value}
                    >
                        {type}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
