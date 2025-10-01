"use client";
import { ClassNameValue, twMerge } from "tailwind-merge";
import { Button } from "../ui/button";
import { Controller, Control, FieldPath } from "react-hook-form";
import { TextDocumentSection, TextDocument, SpanSection } from "./types";

const sectionInputCss: ClassNameValue = [
    "hover:bg-primary/10",
    "transition-all",
    "ease-in-out",
    "duration-300",
];

type DocumentSectionProps = {
    control: Control<TextDocument>;
    name: FieldPath<TextDocument>;
    section: TextDocumentSection;
    className?: string;
};

export default function DocumentSection({
    control,
    name,
    section,
    className,
    ...props
}: DocumentSectionProps & React.ComponentProps<"div">) {
    const isTextType = section.type === "p" || section.type === "code";

    // Helper for auto-resizing textarea
    function autoResize(el: HTMLTextAreaElement | null) {
        if (el) {
            el.style.height = "auto";
            el.style.height = `${el.scrollHeight}px`;
        }
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
            <Button
                className="absolute -left-10 group-hover:opacity-100 opacity-0 transition-all ease-in-out top-0"
                variant="outline"
                size="icon"
                type="button"
            />
            {isTextType ? (
                <Controller
                    control={control}
                    name={`${name}.data.text` as FieldPath<TextDocument>}
                    defaultValue={section.data.text || [{ text: "" }]}
                    render={({ field: { onChange, value } }) => {
                        const textArray: SpanSection[] = value || [
                            { text: "" },
                        ];
                        return (
                            <div className="w-full">
                                {textArray.map((span, idx) => (
                                    <textarea
                                        key={idx}
                                        className="w-full p-2 resize-none"
                                        wrap="soft"
                                        ref={autoResize}
                                        onChange={(e) => {
                                            const newTextArray = textArray.map(
                                                (s, i) =>
                                                    i === idx
                                                        ? {
                                                              ...s,
                                                              text: e.target
                                                                  .value,
                                                          }
                                                        : s
                                            );
                                            onChange(newTextArray);
                                            autoResize(e.target);
                                        }}
                                        value={span.text}
                                        rows={1}
                                        style={{ overflow: "hidden" }}
                                    />
                                ))}
                            </div>
                        );
                    }}
                />
            ) : (
                <div className="w-full p-2 text-muted-foreground italic">
                    {section.type} not supported yet
                </div>
            )}
        </div>
    );
}
