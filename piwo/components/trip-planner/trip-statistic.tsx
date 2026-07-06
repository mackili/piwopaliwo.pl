import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../ui/card";
import { twMerge } from "tailwind-merge";

export default function TripStatistic({
    title,
    value,
    description,
    ...props
}: {
    title: string;
    value: React.ReactNode;
    description?: string;
} & React.ComponentProps<"div">) {
    return (
        <Card {...props} className={twMerge("gap-2", props?.className)}>
            <CardHeader>
                <CardTitle className="text-muted-foreground text-xs font-medium uppercase">
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent className="text-primary font-serif uppercase font-bold text-lg max-h-8 overflow-x-hidden text-ellipsis whitespace-nowrap">
                {value}
            </CardContent>
            <CardFooter className="text-muted-foreground text-xs font-medium uppercase">
                {description && <p>{description}</p>}
            </CardFooter>
        </Card>
    );
}
