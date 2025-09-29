import PiwoPaliwoBanner from "@/components/piwopaliwo/piwopaliwobanner";
import TeamSection from "./team/page";

export default async function Home() {
    return (
        <>
            <main className="flex flex-col gap-[32px] row-start-2 snap-normal snap-y w-full scroll-smooth min-h-screen pb-20">
                <section className="h-screen items-center flex select-none snap-start shrink-0 relative">
                    <PiwoPaliwoBanner />
                </section>
                <section
                    className="min-h-screen items-start flex snap-start shrink-0 px-8 sm:px-10"
                    id="team"
                >
                    <TeamSection />
                </section>
            </main>
        </>
    );
}
