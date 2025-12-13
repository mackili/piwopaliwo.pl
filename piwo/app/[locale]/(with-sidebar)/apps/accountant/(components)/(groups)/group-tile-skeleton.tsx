import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
export default function GroupCardSkeleton() {
    return (
        <Card className="w-full">
            <CardHeader>
                <div className="aspect-video w-full bg-accent rounded-xl animate-pulse"></div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <CardTitle className="w-full h-8 rounded-xl animate-pulse bg-accent" />
            </CardContent>
            <CardFooter>
                <div className="w-full h-10 rounded-md bg-accent"></div>
            </CardFooter>
        </Card>
    );
}
