import PiwoPaliwoBanner from "@/components/piwopaliwo/piwopaliwobanner";
import TeamSection from "./team/page";
// import { Button } from "@/components/ui/button";
// import { getI18n } from "@/locales/server";
// import Link from "next/link";

export default async function Home() {
    // const t = await getI18n();
    return (
        <>
            <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen pb-20 mx-10 sm:mx-20">
                <main className="flex flex-col gap-[32px] row-start-2 snap-normal snap-y overflow-y-scroll scroll-smooth min-h-screen">
                    <section className="h-screen items-center flex select-none snap-start shrink-0 relative">
                        <PiwoPaliwoBanner />
                        {/* <div className="absolute bottom-10 w-full flex flex-col items-center-safe justify-center-safe">
                            <Link href="#team">
                                <Button variant="fluid">{t("team")}</Button>
                            </Link>
                        </div> */}
                    </section>
                    <section
                        className="min-h-screen items-start flex snap-start shrink-0 px-8 sm:px-10"
                        id="team"
                    >
                        <TeamSection />
                    </section>
                </main>
            </div>
        </>
    );
}
