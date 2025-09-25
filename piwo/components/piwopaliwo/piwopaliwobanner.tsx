"use client";
import DictionaryEntry, { DictionaryEntryType } from "./dictionary-entry";
import { useRef, useState, useEffect } from "react";

const entries: DictionaryEntryType[] = [
    {
        title: "piwo",
        type: "rzeczownik; rodz. nijaki",
        description:
            "pienisty napój, zwykle o małej zawartości alkoholu, otrzymywany przez fermentację ze słodu jęczmiennego, chmielu, drożdży i wody; też: porcja tego napoju",
        variations: ["piwko", "piwsko"],
        source: {
            name: "Słownik Języka Polskiego | PWN",
            link: "https://sjp.pwn.pl/slowniki/piwo.html",
        },
    },
    {
        title: "paliwo",
        type: "rzeczownik; rodz. nijaki",
        description:
            "substancja wykorzystywana jako źródło energii, służącej do napędzania różnych urządzeń",
        variations: ["paliwko", "paliwsko"],
        source: {
            name: "Wielki słownik języka polskiego | PAN",
            link: "https://wsjp.pl/haslo/podglad/6597/paliwo",
        },
    },
];

// const repeatedEntries = [...entries, ...entries, ...entries];
const repeatedEntries = [...entries, ...entries];

export default function PiwoPaliwoBanner() {
    const trackRef = useRef<HTMLDivElement>(null);
    const [setWidth, setSetWidth] = useState(0);

    useEffect(() => {
        if (trackRef.current) {
            const children = trackRef.current.children;
            let width = 0;
            for (let i = 0; i < children.length / 2; i++) {
                width += (children[i] as HTMLElement).offsetWidth;
            }
            setSetWidth(width);
        }
    }, []);
    return (
        <div
            className="relative w-screen overflow-hidden flex"
            id="carousel-piwo"
        >
            <div
                className="flex flex-row w-full"
                ref={trackRef}
                style={{
                    animation: setWidth
                        ? `carousel ${setWidth / 60}s linear infinite`
                        : undefined,
                }}
            >
                {repeatedEntries.map((entry, key) => (
                    <div key={key} className="flex-shrink-0 px-24">
                        <DictionaryEntry entry={entry} />
                    </div>
                ))}
            </div>
            <style jsx>{`
                @keyframes carousel {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-${setWidth}px);
                    }
                }
                #carousel-piwo:hover .flex {
                    animation-play-state: paused;
                }
            `}</style>
        </div>
    );
}
