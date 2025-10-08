import { twMerge } from "tailwind-merge";
import { Textarea } from "../ui/textarea";
import { useRef } from "react";
type Props = React.ComponentPropsWithoutRef<typeof Textarea> & {
    className?: string;
};

export default function CodeEditor({ className, ...field }: Props) {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    function autoResize() {
        if (textareaRef.current) {
            // console.log(textareaRef.current.style.height);
            // console.log(textareaRef.current.scrollHeight);
            textareaRef.current.style.minHeight = "auto";
            textareaRef.current.style.minHeight = `${textareaRef.current.scrollHeight}px`;
            // console.log(textareaRef.current.scrollHeight);
        }
    }
    return (
        <code className={className}>
            <Textarea
                {...field}
                className={twMerge(
                    "w-full p-2 resize-none overflow-hidden",
                    className
                )}
                wrap="soft"
                ref={(el) => {
                    textareaRef.current = el;
                    autoResize();
                }}
            />
        </code>
    );
}
