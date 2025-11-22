import LoadingSpinner from "@/components/ui/loading-spinner";

export default function Loading() {
    return (
        <div className="flex items-center justify-center h-screen w-full">
            <LoadingSpinner className="w-16 h-16" />
        </div>
    );
}
