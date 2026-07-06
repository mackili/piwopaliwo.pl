import { menuItems } from "@/components/navbar-pill.data";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { getI18n, getStaticParams } from "@/locales/server";
import { setStaticParamsLocale } from "next-international/server";
import Link from "next/link";

export function generateStaticParams() {
    return getStaticParams();
}

export default async function Page({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setStaticParamsLocale(locale);
    const t = await getI18n();
    const appsMenuItem = [...menuItems]?.find(
        (item) => item.id === "NavMenu.apps",
    );
    return (
        <div className="space-y-16 mx-8">
            <div className="space-y-8">
                <h1>{t("NavMenu.apps")}</h1>
                <p>{t("NavMenu.apps_description")}</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
                {appsMenuItem?.children?.map((app) =>
                    app?.link && app?.status === "active" ? (
                        <Link
                            key={app.id}
                            href={`/${locale}/apps/${app.link}`}
                            className="cursor-pointer"
                        >
                            <Card>
                                <CardHeader>
                                    {<app.icon className="w-10 h-10" />}
                                </CardHeader>
                                <CardContent>
                                    <CardTitle>
                                        {
                                            // @ts-expect-error translation inference
                                            t(`${app.id}`)
                                        }
                                    </CardTitle>
                                </CardContent>
                                <CardFooter>
                                    {app?.description &&
                                        // @ts-expect-error translation inference
                                        t(`${app.description}`)}
                                </CardFooter>
                            </Card>
                        </Link>
                    ) : (
                        <Card
                            key={app.id}
                            aria-disabled
                            className="bg-secondary cursor-not-allowed"
                        >
                            <CardHeader>
                                {<app.icon className="w-10 h-10" />}
                            </CardHeader>
                            <CardContent>
                                <CardTitle>
                                    {
                                        // @ts-expect-error translation inference
                                        t(`${app.id}`)
                                    }
                                </CardTitle>
                            </CardContent>
                            <CardFooter>
                                {app?.description &&
                                    // @ts-expect-error translation inference
                                    t(`${app.description}`)}
                            </CardFooter>
                        </Card>
                    ),
                )}
            </div>
        </div>
    );
}
