import { ConsumedDrink } from "@/components/beercounter/types";
import CalendarHeatmap from "@/components/ui/calendar-heatmap";

async function groupByDate(drinks: ConsumedDrink[]) {
    const map = new Map<string, number>();
    drinks.forEach((drink) => {
        // Use only the date part (YYYY-MM-DD)
        const dateStr = new Date(drink.drank_at).toISOString().slice(0, 10);
        map.set(dateStr, (map.get(dateStr) || 0) + drink.quantity);
    });
    // Convert to desired format
    return Array.from(map.entries()).map(([dateStr, weight]) => ({
        date: new Date(dateStr),
        weight,
    }));
}

export default async function BeerHeatmap({ data }: { data: ConsumedDrink[] }) {
    const grouped = await groupByDate(data);
    return (
        <CalendarHeatmap
            className="h-200 aspect-5/4"
            values={grouped}
            variantClassnames={[
                "bg-yellow-500",
                "bg-yellow-400",
                "bg-yellow-300",
                "bg-yellow-100",
                "bg-yellow-200",
            ]}
        />
    );
}
