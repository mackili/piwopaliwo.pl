import {
    AutomaticBreadcrumbs,
    BreadcrumbsSkeleton,
} from "@/components/ui/breadcrumbs";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Suspense } from "react";

export function TopBar() {
    return (
        <section className="border-b border-accent p-2 sticky top-0 z-10 shadow-md antialiased backdrop-blur-md bg-background/50 bg-opacity-80 flex flex-row items-center gap-4">
            <SidebarTrigger />
            <Suspense fallback={<BreadcrumbsSkeleton />}>
                <AutomaticBreadcrumbs />
            </Suspense>
        </section>
    );
}
