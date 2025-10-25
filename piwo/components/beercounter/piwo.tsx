import { ComponentProps, useRef } from "react";
import "@/components/piwo.css";
import "@/components/beercounter/piwo.css";
import { beerSizes } from "./beer-sizes";

const MAX_BEER_SIZE = Math.min(
    (beerSizes || []).sort((a, b) => b.value - a.value)[0]?.value,
    500
);

export default function Beer({
    milliliters,
    ...props
}: { milliliters?: number } & ComponentProps<"div">) {
    const glassRef = useRef<HTMLDivElement>(null);
    const beerContainerRef = useRef<HTMLDivElement>(null);
    const beerRef = useRef<HTMLDivElement>(null);
    const beerHeight = (milliliters: number | undefined) => {
        if (
            !beerRef.current ||
            !beerContainerRef.current ||
            !glassRef.current
        ) {
            return 0;
        }
        const fillRatio = (milliliters || 0) / MAX_BEER_SIZE;
        if (fillRatio > 1) {
            glassRef.current.classList.add("shake-element");
        } else {
            glassRef.current.classList.remove("shake-element");
        }
        const containerHeight = beerContainerRef.current.scrollHeight;
        const beerHeight = milliliters
            ? containerHeight * Math.min(fillRatio, 1)
            : containerHeight;
        return Math.min(beerHeight, containerHeight);
    };
    const setBeerHeight = () => {
        if (!beerRef.current || !beerContainerRef.current) {
            return;
        }
        beerRef.current.style.setProperty(
            "--beer-height",
            `${beerHeight(milliliters)}px`
        );
    };
    return (
        <div {...props}>
            <div
                id="glass"
                className="h-full w-full border-b-2 border-x-2 pb-1 px-1 transition-all ease-in-out"
                ref={glassRef}
            >
                <div
                    id="beer-container"
                    className="h-full w-full relative flex items-end content-end"
                    ref={beerContainerRef}
                >
                    <div
                        id="beer-content"
                        className="w-full h-full overflow-hidden relative bottom-0 transition-all ease-in-out"
                        ref={(el) => {
                            beerRef.current = el;
                            setBeerHeight();
                        }}
                    ></div>
                </div>
            </div>
        </div>
    );
}
