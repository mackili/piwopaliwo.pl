import { Controller, Control, FieldPath } from "react-hook-form";
import { TextDocument, SpanSection, DocumentSectionType } from "./types";
import { createElement } from "react";
export default function TextSection({
    control,
    name,
    value,
    Type,
}: {
    control: Control<TextDocument>;
    name: FieldPath<TextDocument>;
    value: SpanSection[];
    Type: DocumentSectionType;
}) {
    function autoResize(el: HTMLTextAreaElement | null) {
        if (el) {
            el.style.height = "auto";
            el.style.height = `${el.scrollHeight}px`;
        }
    }
    return (
        <Controller
            control={control}
            name={name}
            defaultValue={value}
            render={({ field: { onChange, value } }) =>
                createElement(
                    Type,
                    { className: "w-full" },
                    (Array.isArray(value)
                        ? value
                        : [{ text: value || "" }]
                    ).map((span, idx) => (
                        <textarea
                            key={idx}
                            className="w-full p-2 resize-none"
                            wrap="soft"
                            ref={autoResize}
                            onChange={(e) => {
                                const newTextArray = value.map(
                                    (s: SpanSection, i: number) =>
                                        i === idx
                                            ? { ...s, text: e.target.value }
                                            : s
                                );
                                onChange(newTextArray);
                                autoResize(e.target);
                            }}
                            value={span.text}
                            rows={1}
                            style={{ overflow: "hidden" }}
                        />
                    ))
                )
            }
        />
    );
}
