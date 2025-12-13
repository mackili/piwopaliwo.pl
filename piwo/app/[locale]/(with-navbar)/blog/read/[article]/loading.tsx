import LoadingSpinner from "@/components/ui/loading-spinner";

export default function Loading() {
    return (
        <div className="flex w-full h-full justify-center items-center">
            <LoadingSpinner className="w-16 h-16" />
        </div>
    );
}
