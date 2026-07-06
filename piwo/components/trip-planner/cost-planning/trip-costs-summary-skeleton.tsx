import { Skeleton } from "@/components/ui/skeleton";

export default function TripCostsSummarySkeleton() {
    return (
        <div className="col-span-full @max-[370px]:grid-cols-1 grid-cols-2 @lg:grid-cols-3 grid gap-4">
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="col-span-full h-40 rounded-xl" />
        </div>
    );
}
