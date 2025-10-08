type CodeEditorProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    value: string;
    onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
};

export default function CodeEditor({
    value,
    onChange,
    ...props
}: CodeEditorProps) {
    return (
        <code>
            <textarea value={value} onChange={onChange} {...props}></textarea>
        </code>
    );
}
