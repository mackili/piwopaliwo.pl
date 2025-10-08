"use client";

import { useState } from "react";
import CodeEditor from "./code-editor";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { useForm } from "react-hook-form";

export default function MarkdownEditor() {
    const [previewStatus, setPreviewStatus] = useState<"visible" | "hidden">(
        "hidden"
    );
    const form = useForm();
    return (
        <div>
            <form></form>
        </div>
    );
}
