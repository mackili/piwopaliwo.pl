import Image from "next/image";
import PiwoPaliwoBanner from "@/components/piwopaliwo/piwopaliwobanner";

export default function Home() {
    return (
        <>
            <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen pb-20 mx-10 sm:mx-20">
                <main className="flex flex-col gap-[32px] row-start-2 snap-normal snap-y overflow-y-scroll">
                    <section className="h-screen items-center flex select-none snap-start">
                        <PiwoPaliwoBanner />
                    </section>
                </main>
            </div>
        </>
    );
}
