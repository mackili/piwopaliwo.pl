import {
    Card,
    CardAction,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { fetchTripTimeline, TripTimelineResponseRow } from "../fetch";
import PostgrestErrorDisplay from "@/components/ui/postgrest-error-display";
import { getCurrentLocale, getI18n } from "@/locales/server";
import {
    TripTimelineItemIcon,
    TripTransactionStatusPill,
} from "../icon-factories";
import { ParticipantRow } from "../transport/transport-assignment";
import { Tables } from "@/database.types";
import { TripAccommodationUnitSummary } from "../custom-schemas";
import { getTripLength } from "../reducers";
import FormattedDateText from "@/components/ui/formatted-date-text";
import {
    UserHighlightContextProvider,
    UserHighlightToggle,
} from "./user-highlight-provider";
import { TripTimelineParticipantRow } from "./trip-timeline-participant-row";
import Printer from "@/components/ui/printer";

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
    const [locale, { data, error }, t] = await Promise.all([
        getCurrentLocale(),
        fetchTripTimeline(tripId),
        getI18n(),
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
            <UserHighlightContextProvider>
                <UserHighlightToggle
                    label={t("TripPlanner.timeline.highlightYourActivities")}
                />
                <PostgrestErrorDisplay error={error} />
                {groupedData &&
                    Object.keys(groupedData).map((day, index) => (
                        <Card
                            key={index}
                            id={`trip-timeline-${new Date(day).toISOString()}-${index}`}
                        >
                            <CardHeader>
                                <CardTitle>
                                    <div className="flex flex-row flex-wrap gap-8 items-center">
                                        <div className="flex flex-col gap items-center justify-center">
                                            <h6 className="text-muted-foreground font-medium text-sm p-0 m-0">
                                                <FormattedDateText
                                                    locale={locale}
                                                    date={new Date(day)}
                                                    format={{
                                                        weekday: "short",
                                                    }}
                                                />
                                            </h6>
                                            <h5 className="font-serif font-extrabold text-2xl p-0 m-0">
                                                <FormattedDateText
                                                    locale={locale}
                                                    date={new Date(day)}
                                                    format={{ day: "2-digit" }}
                                                />
                                            </h5>
                                        </div>
                                        <div>
                                            <div className="font-bold text-2xl flex flex-row gap-4 flex-wrap items-center">
                                                <p>{`${t("day")} ${getTripDayNumber(new Date(day))}`}</p>
                                                <p className="font-normal text-muted-foreground text-base">
                                                    (
                                                    <FormattedDateText
                                                        locale={locale}
                                                        date={new Date(day)}
                                                    />
                                                    )
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardTitle>
                                <CardAction>
                                    <Printer
                                        targetId={`trip-timeline-${new Date(day).toISOString()}-${index}`}
                                    />
                                </CardAction>
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
                                        />
                                    ))}
                            </CardContent>
                        </Card>
                    ))}
            </UserHighlightContextProvider>
        </div>
    );
}

async function TripTimelineItem({
    item,
    locale,
}: {
    item: TripTimelineAggregatedRow;
    locale: string;
}) {
    const [t] = await Promise.all([getI18n()]);
    return (
        <div className="border-b pb-8 px-6 last:border-b-0 first:border-t pt-4 first:pt-8">
            <div className="flex gap-4 flex-row flex-wrap items-center">
                <div className="font-mono col-span-1">
                    {item?.start_date && (
                        <FormattedDateText
                            locale={locale}
                            date={new Date(item.eventDate)}
                            format={{
                                timeStyle: "short",
                            }}
                        />
                    )}
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
                        <h4>{`${item.timeType === TimelineItemTimeType.START ? t("TripPlanner.accommodation.checkIn") : t("TripPlanner.accommodation.checkOut")} ${item.name}`}</h4>
                    ) : (
                        <h4>{`${item.timeType === TimelineItemTimeType.START ? t("TripPlanner.travel.departure") : t("TripPlanner.travel.arrival")} ${item.name}`}</h4>
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
                                    <TripTimelineParticipantRow
                                        key={index}
                                        detail={detail}
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
                                        <TripTimelineParticipantRow
                                            key={index}
                                            detail={assignment}
                                        />
                                    ));
                            })}
                    </div>
                </div>
            </div>
        </div>
    );
}
