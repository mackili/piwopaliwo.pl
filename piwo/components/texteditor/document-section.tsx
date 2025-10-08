"use client";
import { twMerge } from "tailwind-merge";
import { Control, FieldPath, UseFormGetValues } from "react-hook-form";
import {
    TextDocumentSection,
    TextDocument,
    DocumentSectionType,
    ImageSectionType,
    SpanSection,
} from "./types";
import SectionTypeDropdown from "./section-type-dropdown";
import TextSection from "./text-section";
import ImageSection from "./image-section";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

const sectionInputCss = [
    "hover:bg-primary/10",
    "transition-all",
    "ease-in-out",
    "duration-300",
];

export default function DocumentSection({
    control,
    name,
    section,
    setValue,
    getValues,
    className,
    onNewSection,
    onRemove,
    ...props
}: {
    control: Control<TextDocument>;
    name: FieldPath<TextDocument>;
    section: TextDocumentSection;
    setValue: (
        name: FieldPath<TextDocument>,
        value: TextDocumentSection
    ) => void;
    getValues: UseFormGetValues<TextDocument>;
    className?: string;
    onNewSection: (type: string) => void;
    onRemove: () => void;
} & React.ComponentProps<"div">) {
    {
        const [type, setType] = useState<DocumentSectionType>(section.type);
        useEffect(() => {}, [type]);
        function handleTypeChange(newType: DocumentSectionType) {
            const oldSection = getValues(name) as TextDocumentSection;
            if (newType === type) return;
            const newSection = {
                ...oldSection,
                type: newType as TextDocumentSection["type"],
            } as TextDocumentSection;
            setValue(name, newSection);
            section.type = newType;
            section.data = newSection.data;
            setType(newType || "p");
        }

        return (
            <div
                className={twMerge(
                    sectionInputCss,
                    className || "",
                    "relative group min-h-9 flex justify-center-safe"
                )}
                {...props}
            >
                <div className="absolute -left-10 group-hover:opacity-100 opacity-0 transition-all ease-in-out -top-2 flex flex-col">
                    <SectionTypeDropdown
                        value={type}
                        // className="absolute -left-10 group-hover:opacity-100 opacity-0 transition-all ease-in-out top-0"
                        onChange={handleTypeChange}
                    />
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onNewSection("p")}
                        type="button"
                    >
                        +
                    </Button>
                </div>
                <div className="flex gap-2 items-center w-full">
                    {type === "image" ? (
                        <ImageSection
                            control={control}
                            name={name as FieldPath<TextDocument>}
                            value={(section as ImageSectionType).data}
                        />
                    ) : (
                        <TextSection
                            control={control}
                            name={
                                `${name}.data.text` as FieldPath<TextDocument>
                            }
                            // @ts-expect-error it will not have additional properties
                            value={section.data.text as SpanSection[]}
                            Type={section.type}
                        />
                    )}
                </div>
                <div className="opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-all ease-in-out absolute -top-0 -right-10">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemove()}
                    >
                        -
                    </Button>
                </div>
            </div>
        );
    }
}
