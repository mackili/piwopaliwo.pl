import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleDashed } from "lucide-react";

export default function BeerDashboardCardSuspense() {
    return (
        <Card className="container animate-pulse">
            <CardHeader className="flex items-center justify-center">
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    <CircleDashed className="animate-spin" />
                </CardTitle>
            </CardHeader>
            <CardFooter className="text-sm"></CardFooter>
        </Card>
    );
}
