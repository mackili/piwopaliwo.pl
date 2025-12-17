"use client";
import { useCurrentLocale } from "@/locales/client";
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
        locale: "pl",
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
        locale: "pl",
    },
    {
        title: "beer",
        type: "noun",
        description:
            "a slightly bitter, alcoholic drink made from grain, or a serving of this drink in a glass or other container",
        source: {
            name: "Cambridge Dictionary",
            link: "https://dictionary.cambridge.org/dictionary/english/beer",
        },
        locale: "en",
        pronunciation: "/bɪər/",
    },
    {
        title: "fuel",
        type: "noun",
        description:
            "a substance that is used to provide heat or power, usually by being burned",
        source: {
            name: "Cambridge Dictionary",
            link: "https://dictionary.cambridge.org/dictionary/english/fuel",
        },
        locale: "en",
        pronunciation: "/ˈfjuː.əl/",
    },
    {
        title: "pivo",
        type: "podstatné jméno; rod střední",
        description:
            "pěnivý nápoj, obvykle s nízkým obsahem alkoholu, vyráběný kvašením ze sladovaného ječmene, chmele, kvasnic a vody; také: porce tohoto nápoje",
        variations: ["pivko", "pivíčko"],
        source: {
            name: "Slovník spisovného jazyka českého",
            link: "https://ssjc.ujc.cas.cz/",
        },
        locale: "cz",
        pronunciation: "/ˈpɪvo/",
    },
    {
        title: "palivo",
        type: "podstatné jméno; rod střední",
        description:
            "látka používaná jako zdroj energie k pohonu nebo provozu různých zařízení",
        variations: ["palívko"],
        source: {
            name: "Slovník spisovného jazyka českého",
            link: "https://ssjc.ujc.cas.cz/",
        },
        locale: "cz",
        pronunciation: "/ˈpalɪvo/",
    },
    {
        title: "õlu",
        type: "nimisõna",
        description:
            "vahutav alkohoolne jook, tavaliselt madala alkoholisisaldusega, mis on valmistatud odralinnaste, humala, pärmi ja vee kääritamisel; ka: selle joogi portsjon",
        variations: ["õlleke"],
        source: {
            name: "Eesti keele seletav sõnaraamat",
            link: "https://www.eki.ee/dict/ekss/",
        },
        locale: "ee",
        pronunciation: "/ˈɤlu/",
    },
    {
        title: "kütus",
        type: "nimisõna",
        description:
            "aine, mida kasutatakse soojuse või energia tootmiseks, tavaliselt põletamise teel",
        variations: ["kütuseke"],
        source: {
            name: "Eesti keele seletav sõnaraamat",
            link: "https://www.eki.ee/dict/ekss/",
        },
        locale: "ee",
        pronunciation: "/ˈkytus/",
    },
];

// const repeatedEntries = [...entries, ...entries, ...entries];
const repeatedEntries = [...entries, ...entries];
function filterLocaleEntries(locale: string) {
    const localeEntries = repeatedEntries.filter(
        (entry) => entry.locale && entry.locale === locale
    );
    if (localeEntries.length === 0) {
        return repeatedEntries.filter(
            (entry) => entry.locale && entry.locale === "pl"
        );
    }
    return localeEntries;
}

export default function PiwoPaliwoBanner() {
    const trackRef = useRef<HTMLDivElement>(null);
    const [setWidth, setSetWidth] = useState(0);
    const locale = useCurrentLocale();

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
                {filterLocaleEntries(locale).map((entry, key) => (
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
