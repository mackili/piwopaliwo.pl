import { Skeleton } from "@/components/ui/skeleton";
import { twMerge } from "tailwind-merge";

function ArticleSkeleton({ className }: React.ComponentProps<"div">) {
    return (
        <div
            className={twMerge(
                "flex flex-col w-full gap-12 p-4 md:p-8 antialiased backdrop-blur-xs shadow-lg",
                className
            )}
        >
            <Skeleton className="flex w-full aspect-2/3 relative" />
            <Skeleton className="w-full pb-6 h-18" />
            <div className="flex flex-row gap-4">
                <Skeleton className="rounded-full w-12 h-12 shrink-0" />
                <Skeleton className="w-full h-12" />
            </div>
        </div>
    );
}

export default function LoadingBlog() {
    return (
        <div className="w-full">
            <div className="py-8 flex items-center-safe justify-between">
                <header>Blog</header>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 w-full gap-4">
                <ArticleSkeleton />
                <ArticleSkeleton />
                <ArticleSkeleton className="sm:hidden" />
            </div>
        </div>
    );
}
