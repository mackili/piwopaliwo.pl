import { LoaderCircle } from "lucide-react";

export default function Loading() {
    return (
        <div className="h-screen w-full flex justify-center-safe items-center-safe">
            <LoaderCircle className="animate-spin" />
        </div>
    );
}
