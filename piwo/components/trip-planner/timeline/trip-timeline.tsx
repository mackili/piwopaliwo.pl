import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    fetchCurrentTripParticipant,
    fetchTripTimeline,
    TripTimelineResponseRow,
} from "../fetch";
import PostgrestErrorDisplay from "@/components/ui/postgrest-error-display";
import { getCurrentLocale } from "@/locales/server";
import {
    TripTimelineItemIcon,
    TripTransactionStatusPill,
} from "../icon-factories";
import { ParticipantRow } from "../transport/transport-assignment";
import { Tables } from "@/database.types";
import { TripAccommodationUnitSummary } from "../custom-schemas";
import { getTripLength } from "../reducers";

enum TimelineItemTimeType {
    START = "start",
    END = "end",
}

type TripTimelineAggregatedRow = TripTimelineResponseRow & {
    eventDate: string;
    timeType: TimelineItemTimeType;
};

type TripTimelineAggregated = {
    [date: string]: TripTimelineAggregatedRow[];
};

export default async function TripTimeline({ tripId }: { tripId: string }) {
    const [locale, { data, error }, { data: currentTripParticipant }] =
        await Promise.all([
            getCurrentLocale(),
            fetchTripTimeline(tripId),
            fetchCurrentTripParticipant(tripId),
        ]);
    const groupedData = data?.reduce(
        (acc: TripTimelineAggregated, current: TripTimelineResponseRow) => {
            if (!current.start_date) return acc;
            const startDateDay = current.start_date.slice(0, 10);
            if (Object.keys(acc).includes(startDateDay)) {
                acc[startDateDay].push({
                    ...current,
                    eventDate: current.start_date,
                    timeType: TimelineItemTimeType.START,
                });
            } else {
                acc[startDateDay] = [
                    {
                        ...current,
                        eventDate: current.start_date,
                        timeType: TimelineItemTimeType.START,
                    },
                ];
            }
            if (!current.end_date) return acc;
            const endDateDay = current.end_date?.slice(0, 10);
            if (Object.keys(acc).includes(endDateDay)) {
                acc[endDateDay].push({
                    ...current,
                    eventDate: current.end_date,
                    timeType: TimelineItemTimeType.END,
                });
            } else {
                acc[endDateDay] = [
                    {
                        ...current,
                        eventDate: current.end_date,
                        timeType: TimelineItemTimeType.END,
                    },
                ];
            }
            return acc;
        },
        {},
    );
    const firstDate = groupedData && Object.keys(groupedData)[0];
    const getTripDayNumber = (day: Date) =>
        firstDate
            ? getTripLength({ startdate: new Date(firstDate), endDate: day }) +
              1
            : undefined;
    return (
        <div className="flex flex-col gap-8">
            <PostgrestErrorDisplay error={error} />
            {groupedData &&
                Object.keys(groupedData).map((day, index) => (
                    <Card key={index}>
                        <CardHeader>
                            <CardTitle>
                                <div className="flex flex-row flex-wrap gap-8 items-center">
                                    <div className="flex flex-col gap items-center justify-center">
                                        <h6 className="text-muted-foreground font-medium text-sm p-0 m-0">
                                            {Intl.DateTimeFormat(locale, {
                                                weekday: "short",
                                            }).format(new Date(day))}
                                        </h6>
                                        <h5 className="font-serif font-extrabold text-2xl p-0 m-0">
                                            {Intl.DateTimeFormat(locale, {
                                                day: "2-digit",
                                            }).format(new Date(day))}
                                        </h5>
                                    </div>
                                    <div>
                                        <div className="font-bold text-2xl flex flex-row gap-4 flex-wrap items-center">
                                            <p>{`Day ${getTripDayNumber(new Date(day))}`}</p>
                                            <p className="font-normal text-muted-foreground text-base">
                                                (
                                                {Intl.DateTimeFormat(
                                                    locale,
                                                ).format(new Date(day))}
                                                )
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 px-0">
                            {groupedData[day]
                                ?.sort(
                                    (a, b) =>
                                        new Date(a.eventDate).getTime() -
                                        new Date(b.eventDate).getTime(),
                                )
                                ?.map((item, index) => (
                                    <TripTimelineItem
                                        key={index}
                                        item={item}
                                        locale={locale}
                                        currentTripParticipantId={
                                            currentTripParticipant?.id
                                        }
                                    />
                                ))}
                        </CardContent>
                    </Card>
                ))}
        </div>
    );
}

function TripTimelineItem({
    item,
    locale,
    currentTripParticipantId,
}: {
    item: TripTimelineAggregatedRow;
    locale: string;
    currentTripParticipantId?: string | null;
}) {
    return (
        <div className="border-b pb-8 px-6 last:border-b-0 first:border-t pt-4 first:pt-8">
            <div className="flex gap-4 flex-row flex-wrap items-center">
                <div className="font-mono col-span-1">
                    {item?.start_date &&
                        Intl.DateTimeFormat(locale, {
                            timeStyle: "short",
                        }).format(new Date(item.eventDate))}
                </div>
                <div className="flex justify-center items-center rounded-full aspect-square w-10 h-10 border-2 border-secondary bg-accent/10 col-span-1">
                    {item.record_type && item.type && (
                        <TripTimelineItemIcon
                            data={{
                                recordType: item.record_type,
                                type: item.type,
                            }}
                            className="stroke-accent-2 h-6 w-6"
                        />
                    )}
                </div>
                <div className="grow">
                    {item.record_type === "accommodation" ? (
                        <h4>{`${item.timeType === TimelineItemTimeType.START ? "Check-In" : "Check-Out"} ${item.name}`}</h4>
                    ) : (
                        <h4>{`${item.timeType === TimelineItemTimeType.START ? "Departure" : "Arrival"} ${item.name}`}</h4>
                    )}
                    <p>{item.description}</p>
                </div>
                {item?.status && (
                    <div className="shrink">
                        <TripTransactionStatusPill status={item.status} />
                    </div>
                )}
                <div className="basis-full">
                    <div className="flex gap-4 flex-row flex-wrap pt-4">
                        {item.record_type === "travel" &&
                            item?.details &&
                            (
                                item.details as unknown as Tables<"v_trip_participant_details">[]
                            )
                                ?.sort((a, b) =>
                                    (a?.nickname || "").localeCompare(
                                        b?.nickname || "",
                                    ),
                                )
                                ?.map((detail, index) => (
                                    <ParticipantRow
                                        participant={detail}
                                        key={index}
                                        className={
                                            detail?.id ===
                                            currentTripParticipantId
                                                ? "outline-1 outline-offset-4 outline-accent rounded-xl"
                                                : ""
                                        }
                                    />
                                ))}
                        {item.record_type === "accommodation" &&
                            item?.details &&
                            (
                                item.details as unknown as TripAccommodationUnitSummary[]
                            )?.map((unit) => {
                                return unit.assignments
                                    ?.sort((a, b) =>
                                        (a?.nickname || "").localeCompare(
                                            b?.nickname || "",
                                        ),
                                    )
                                    .map((assignment, index) => (
                                        <ParticipantRow
                                            key={index}
                                            participant={assignment}
                                            className={
                                                assignment?.id ===
                                                currentTripParticipantId
                                                    ? "outline-1 outline-offset-4 outline-accent rounded-xl"
                                                    : ""
                                            }
                                        />
                                    ));
                            })}
                    </div>
                </div>
            </div>
        </div>
    );
}
