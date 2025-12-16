"use client";
import { ComponentProps } from "react";
import { Group } from "@/app/[locale]/(with-sidebar)/apps/accountant/types";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { CameraOff } from "lucide-react";
import Link from "next/link";
import { useCurrentLocale } from "@/locales/client";

export default function GroupCard({
    group,
}: {
    group: Group;
} & ComponentProps<"div">) {
    const locale = useCurrentLocale();
    function groupUrlGenerator(groupId: string) {
        return `/${locale}/apps/accountant/${groupId}`;
    }
    return (
        <Card className="w-full justify-around">
            <CardHeader>
                <div className="aspect-3/1 w-full flex items-center justify-center">
                    {group?.thumbnail_url === null ? (
                        <CameraOff />
                    ) : (
                        <Image
                            src={group.thumbnail_url}
                            alt={group.name}
                            height={100}
                            width={120}
                            className="object-cover w-full h-full rounded-sm lg:rounded-lg xl:rounded-xl"
                        />
                    )}
                </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <CardTitle className="font-serif text-lg font-bold text-nowrap overflow-x-clip">
                    {group.name}
                </CardTitle>
            </CardContent>
            <CardFooter>
                <Link href={groupUrlGenerator(group.id)} className="w-full">
                    <Button variant="default" size="lg" className="w-full">
                        Enter
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
}
