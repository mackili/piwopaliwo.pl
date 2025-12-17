import { ConsumedDrink } from "@/components/beercounter/types";
import { card, CardDefinition } from "./dashboard-cards";
import {
    Card,
    CardAction,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function BeerDashboardCard({
    cardDefinition,
    data,
}: {
    cardDefinition: CardDefinition;
    data: ConsumedDrink[];
}) {
    const calculatedCard = await card(cardDefinition, data);
    return (
        <Card className="container">
            <CardHeader>
                <CardDescription className="text-foreground uppercase">
                    {calculatedCard.label}
                </CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    {calculatedCard.value}
                </CardTitle>
                {cardDefinition?.badgeSelector && (
                    <CardAction>
                        <Badge variant="outline">
                            {calculatedCard?.badge && calculatedCard.badge}
                        </Badge>
                    </CardAction>
                )}
            </CardHeader>
            {calculatedCard?.footer && (
                <CardFooter className="text-sm">
                    {calculatedCard.footer}
                </CardFooter>
            )}
        </Card>
    );
}
