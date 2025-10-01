import { Button } from "../ui/button";
import { TextDocumentSectionSchema, PSection } from "./types";
import { v4 as uuid } from "uuid";

export function defaultSection(documentId: string, order?: number) {
    const section = TextDocumentSectionSchema.parse({
        type: "p",
        id: uuid(),
        documentId: documentId,
        order: order || 1,
        data: { text: [{ text: "" }] },
        children: [],
    } as PSection);
    console.log(section);
    return section;
}

export default function NewSection({
    onAddSection,
}: {
    onAddSection: () => void;
}) {
    return (
        <div className="w-full group min-h-5 flex justify-center-safe">
            <Button
                type="button"
                variant="ghost"
                className="scale-0 opacity-0 hidden group-hover:scale-100 group-hover:opacity-100 group-hover:block!"
                onClick={onAddSection}
            >
                +
            </Button>
        </div>
    );
}
