import LoadingSpinner from "@/components/ui/loading-spinner";

export default function LoadingTeam() {
    return (
        <div className="flex w-full h-full items-center justify-center">
            <LoadingSpinner className="w-16 h-16" />
        </div>
    );
}
