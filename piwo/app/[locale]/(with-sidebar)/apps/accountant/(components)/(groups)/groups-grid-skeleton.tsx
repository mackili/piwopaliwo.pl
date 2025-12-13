import GroupCardSkeleton from "./group-tile-skeleton";

export default function GroupsGridSkeleton() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full p-4">
            <GroupCardSkeleton />
            <GroupCardSkeleton />
            <GroupCardSkeleton />
        </div>
    );
}
