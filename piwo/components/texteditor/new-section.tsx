import { useState } from "react";
import { Button } from "../ui/button";
import {
    TextDocumentSectionSchema,
    DocumentSectionType,
    TextDocumentSection,
    ImageSectionType,
} from "./types";
import { v4 as uuid } from "uuid";
import SectionTypeDropdown from "./section-type-dropdown";
import { twMerge } from "tailwind-merge";

export function defaultSection(
    documentId: string,
    order?: number,
    type: DocumentSectionType = "p"
) {
    console.log(order || 1);
    // @ts-expect-error multiple types possible
    const data: TextDocumentSection = {
        id: uuid(),
        documentId: documentId,
        order: order || 1,
        type: type,
        data: {
            text: [{ text: "" }],
        },
        children: [],
    };
    if (type === "image") {
        (data as ImageSectionType).data.url = "";
        (data as ImageSectionType).data.fallback = "";
        (data as ImageSectionType).data.caption = [{ text: "" }];
    }
    const section = TextDocumentSectionSchema.parse(data);
    return section;
}

export default function NewSection({
    onAddSection,
    className,
}: {
    onAddSection: (type: string) => void;
    className?: string;
}) {
    const [type, setType] = useState<string>("p");
    return (
        <div
            className={twMerge(
                "w-full group min-h-5 flex justify-center-safe",
                className
            )}
        >
            <SectionTypeDropdown
                value={type as DocumentSectionType}
                onChange={setType}
                className="scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100"
            />
            <Button
                type="button"
                variant="ghost"
                className="scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 group-hover:block!"
                onClick={() => onAddSection(type)}
            >
                +
            </Button>
        </div>
    );
}
