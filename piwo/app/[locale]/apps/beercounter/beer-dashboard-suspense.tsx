import {
    Card,
    CardFooter,
    CardHeader,
    CardDescription,
    CardTitle,
} from "@/components/ui/card";

export default function BeerDashboardSuspense() {
    return (
        <div className="w-full h-full grid grid-cols-2 md:grid-cols-3 gap-4">
            <Card className="animate-pulse">
                <CardHeader>
                    <CardDescription />
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl" />
                </CardHeader>
                <CardFooter />
            </Card>
            <Card className="animate-pulse">
                <CardHeader>
                    <CardDescription />
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl" />
                </CardHeader>
                <CardFooter />
            </Card>
            <Card className="animate-pulse">
                <CardHeader>
                    <CardDescription />
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl" />
                </CardHeader>
                <CardFooter />
            </Card>
            <Card className="col-span-full animate-pulse">
                <CardHeader /> <CardFooter />
            </Card>
        </div>
    );
}
