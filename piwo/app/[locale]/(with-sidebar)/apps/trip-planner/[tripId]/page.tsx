import { fetchArticle } from "@/app/[locale]/(with-navbar)/blog/read/[article]/fetch";
import BlogArticle from "@/components/blog/blog-article";
import { fetchTripDetails } from "@/components/trip-planner/fetch";
import { TripIcon, TripStatus } from "@/components/trip-planner/icon-factories";
import { TripParticipantAvatars } from "@/components/trip-planner/participant-avatars";
import TripCountdown from "@/components/trip-planner/trip-countdown";
import TripSuperDetail from "@/components/trip-planner/trip-text-document";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { getCurrentLocale } from "@/locales/server";

export default async function Page({
    params,
}: {
    params: Promise<{ tripId: string }>;
}) {
    const { tripId } = await params;
    const locale = await getCurrentLocale();
    const data = await fetchTripDetails(tripId);
    const textDocument = data.data?.text_document_id
        ? (await fetchArticle(data.data.text_document_id))?.documentData
        : null;
    const tripData = data.data;
    return (
        <div className="p-2 grid grid-cols-12 gap-4">
            {tripData && (
                <>
                    <Card className="col-span-full">
                        <CardHeader className="flex flex-row gap-2 flex-wrap">
                            {tripData?.status && (
                                <TripStatus tripStatus={tripData.status} />
                            )}{" "}
                            <p>
                                {tripData.start_date &&
                                    tripData.end_date &&
                                    `${new Intl.DateTimeFormat(locale).format(
                                        new Date(tripData.start_date),
                                    )} - ${new Intl.DateTimeFormat(
                                        locale,
                                    ).format(new Date(tripData.end_date))}`}
                            </p>
                        </CardHeader>
                        <CardContent>
                            <CardTitle>{tripData.name}</CardTitle>
                            {tripData.description && (
                                <div>{tripData.description}</div>
                            )}
                        </CardContent>
                        <CardFooter className="flex flex-row flex-wrap gap-8">
                            <TripParticipantAvatars
                                participants={tripData.participants}
                                avatarSize="lg"
                            />
                            <Button disabled>Manage Crew</Button>
                            {textDocument && (
                                <TripSuperDetail
                                    title={`${tripData.name} Super Detail`}
                                >
                                    <BlogArticle article={textDocument} />
                                </TripSuperDetail>
                            )}
                        </CardFooter>
                    </Card>
                    <div className="grid col-span-6 grid-cols-subgrid gap-4">
                        <TripCountdown
                            startDate={tripData?.start_date || null}
                        />
                    </div>
                </>
            )}
        </div>
    );
}
