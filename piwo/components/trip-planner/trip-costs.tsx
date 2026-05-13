import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BanknoteIcon, PiggyBankIcon } from "lucide-react";
import TripTransactionEdit from "./edit-transaction";
import { Tables } from "@/database.types";
import TripCostsCard from "./trip-costs-card";
import TripCostsSummary from "./trip-costs-summary";

export default async function TripCosts({
    trip,
    className,
    ...props
}: { trip: Tables<"v_trip_details"> } & ComponentProps<"div">) {
    return (
        <div>
            <Tabs defaultValue="planning">
                <div className="flex flex-row flex-wrap justify-between gap-4">
                    <div className="space-y-2">
                        <p className="font-serif text-2xl font-bold">Costs</p>
                        <p className="text-muted-foreground text-sm">
                            Plan the budget, then track what actually got paid.
                        </p>
                    </div>
                    <div className="flex flex-row flex-wrap gap-4">
                        <TabsList variant="line">
                            <TabsTrigger value="planning">
                                <PiggyBankIcon /> Planning
                            </TabsTrigger>
                            <TabsTrigger value="transactions" disabled>
                                <BanknoteIcon />
                                Transactions
                            </TabsTrigger>
                        </TabsList>
                        <TripTransactionEdit trip={trip} />
                    </div>
                </div>
                <div
                    className={twMerge(
                        "grid grid-cols-12 w-full gap-4",
                        className,
                    )}
                    {...props}
                >
                    {trip?.id && (
                        <>
                            <div className="grow-8 col-span-full lg:col-span-8">
                                <div className="grid max-[350px]:grid-cols-1 grid-cols-2 md:grid-cols-4 gap-4 @container">
                                    <TripCostsSummary
                                        tripId={trip.id}
                                        className="col-span-full @max-[370px]:grid-cols-1 grid-cols-2 @lg:grid-cols-3 grid gap-4"
                                    />
                                    <TripCostsCard
                                        trip={trip}
                                        className="col-span-full"
                                    />
                                </div>
                            </div>
                            <div className="grow-4 gap-4 col-span-full lg:col-span-4">
                                <div>
                                    {/* <TripParticipantsCard trip={trip} /> */}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </Tabs>
        </div>
    );
}
