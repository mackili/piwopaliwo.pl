import { Controller, Control, FieldPath } from "react-hook-form";
import { TextDocument } from "./types";

export default function ImageSection({
    control,
    name,
    value,
}: {
    control: Control<TextDocument>;
    name: FieldPath<TextDocument>;
    value: {
        url: string;
        fallback: string;
        caption?: string | undefined | null;
    };
}) {
    return (
        <div className="w-full flex flex-col gap-2">
            <Controller
                control={control}
                name={`${name}.url` as FieldPath<TextDocument>}
                defaultValue={value.url}
                render={({ field }) => (
                    // @ts-expect-error expect
                    <input
                        className="w-full p-2"
                        type="text"
                        placeholder="Image URL"
                        {...field}
                    />
                )}
            />
            <Controller
                control={control}
                name={`${name}.fallback` as FieldPath<TextDocument>}
                defaultValue={value.fallback}
                render={({ field }) => (
                    // @ts-expect-error expect
                    <input
                        className="w-full p-2"
                        type="text"
                        placeholder="Fallback text"
                        {...field}
                    />
                )}
            />
            {value.url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={value.url}
                    alt={value.fallback}
                    className="max-w-full max-h-48 object-contain"
                />
            )}
        </div>
    );
}
