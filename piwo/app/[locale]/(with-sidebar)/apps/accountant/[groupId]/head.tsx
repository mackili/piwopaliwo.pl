import {
    Card,
    CardAction,
    CardContent,
    CardHeader,
} from "@/components/ui/card";
import { Group } from "../types";
import { ComponentProps } from "react";
import Image from "next/image";
import EditGroupButton from "../(components)/(actions)/edit-group";
import { User } from "@supabase/supabase-js";

export function GroupHead({
    group,
    user,
    ...props
}: { group: Group; user: User } & ComponentProps<"div">) {
    return (
        <Card {...props}>
            <CardHeader>
                <h1>{group.name}</h1>
                <CardAction>
                    <EditGroupButton
                        group={group}
                        user={user}
                        variant={"outline"}
                    />
                </CardAction>
                {group.description && <p>{group.description}</p>}
            </CardHeader>
            <CardContent>
                {group.thumbnail_url && (
                    <Image
                        src={group.thumbnail_url}
                        alt={group.name}
                        height={100}
                        width={400}
                        className="aspect-3/1 object-cover rounded-xl w-full"
                    />
                )}
            </CardContent>
        </Card>
    );
}
