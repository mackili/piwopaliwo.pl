import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="space-y-4">
            <div className="w-full space-y-2">
                <Skeleton className="w-64 h-8" />
                <Skeleton className="w-96 h-6" />
            </div>
            <div className="space-y-4">
                <Skeleton className="w-full h-256"></Skeleton>
            </div>
        </div>
    );
}
