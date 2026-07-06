import GroupTrips from "@/components/trip-planner/groups/group-trips";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default function Page() {
    return (
        <div className="grid grid-cols-1 gap-4 p-4">
            <Suspense
                fallback={
                    <>
                        <Skeleton className="w-full h-50 rounded-lg" />
                        <Skeleton className="w-full h-64 rounded-lg" />
                    </>
                }
            >
                <GroupTrips />
            </Suspense>
        </div>
    );
}
