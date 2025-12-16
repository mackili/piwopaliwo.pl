"use client";
import Link from "next/link";
import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "./breadcrumb";
import { Button } from "./button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./dropdown-menu";
import { useCurrentLocale } from "@/locales/client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const MAX_CRUMBS_DISPLAYED = 2;

export function AutomaticBreadcrumbs() {
    const locale = useCurrentLocale();
    const pathname = usePathname();
    const [crumbs, setCrumbs] = useState<string[]>([]);
    useEffect(() => {
        setCrumbs(
            pathname
                ?.split("/")
                .filter((result) => result.length > 0 && result !== locale) ||
                []
        );
    }, [locale, pathname]);

    const hiddenCrumbsCount = Math.max(
        0,
        crumbs.length - 1 - MAX_CRUMBS_DISPLAYED
    );
    const hiddenCrumbs = crumbs.slice(1, hiddenCrumbsCount + 1);
    const visibleCrumbs = crumbs.slice(
        Math.max(crumbs.length - MAX_CRUMBS_DISPLAYED, 1),
        crumbs.length
    );
    return (
        <Breadcrumb>
            {crumbs.length > 0 && (
                <BreadcrumbList>
                    <BreadcrumbItem className="text-primary">
                        <Link href={`/${locale}/${crumbs[0]}`}>
                            <Button type="button" variant="ghost" size="sm">
                                {crumbs[0].toUpperCase()}
                            </Button>
                        </Link>
                    </BreadcrumbItem>
                    {crumbs.length > 0 && <BreadcrumbSeparator />}
                    {hiddenCrumbsCount > 0 && (
                        <>
                            <BreadcrumbItem>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="flex items-center gap-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            type="button"
                                        >
                                            <BreadcrumbEllipsis className="size-4" />
                                            <span className="sr-only">
                                                Toggle menu
                                            </span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align="start"
                                        className="z-150"
                                    >
                                        {hiddenCrumbs.map((crumb, index) => (
                                            <DropdownMenuItem key={index}>
                                                <Link href={""}>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        type="button"
                                                    >
                                                        {crumb.toUpperCase()}
                                                    </Button>
                                                </Link>
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                        </>
                    )}
                    {visibleCrumbs.map((crumb, index) => (
                        <div
                            key={index}
                            className="flex flex-row flex-nowrap gap-2 items-center"
                        >
                            <BreadcrumbItem className="text-primary">
                                <Link
                                    href={`/${locale}/${crumbs
                                        .slice(0, index + 2 + hiddenCrumbsCount)
                                        .join("/")}`}
                                >
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                    >
                                        {crumb.toUpperCase()}
                                    </Button>
                                </Link>
                            </BreadcrumbItem>
                            <>
                                {hiddenCrumbsCount === 0 &&
                                    index + 1 < visibleCrumbs.length && (
                                        <BreadcrumbSeparator />
                                    )}
                            </>
                        </div>
                    ))}
                </BreadcrumbList>
            )}
        </Breadcrumb>
    );
}

export function BreadcrumbsSkeleton() {
    return (
        <Breadcrumb>
            <BreadcrumbList>
                <div className="w-16 bg-accent animate-pulse"></div>
                <BreadcrumbSeparator />
                <div className="w-16 bg-accent animate-pulse"></div>
                <BreadcrumbSeparator />
                <div className="w-16 bg-accent animate-pulse"></div>
            </BreadcrumbList>
        </Breadcrumb>
    );
}
