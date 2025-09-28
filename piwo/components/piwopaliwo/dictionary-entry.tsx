export type DictionaryEntryType = {
    title: string;
    type: string;
    description: string;
    variations?: string[];
    source?: {
        name: string;
        link?: string;
    };
    locale?: string;
    pronunciation?: string;
};
export default function DictionaryEntry({
    entry,
}: {
    entry: DictionaryEntryType;
}) {
    return (
        <div
            className={`font-serif flex shrink-0 items-center-safe justify-start snap-center snap-always flex-col max-w-sm sm:max-w-2xl h-full gap-4`}
        >
            <p className="w-full text-start font-[600] text-7xl sm:text-9xl py-4">
                <span>{entry.title}</span>
                {entry.pronunciation && (
                    <span className="text-5xl sm:text-7xl italic font-medium">
                        {" "}
                        {entry.pronunciation}
                    </span>
                )}
            </p>
            <p className="w-full text-start font-[500] text-2xl italic">
                ({entry.type})
            </p>
            <div className="flex flex-col gap-2 w-full">
                <p className="text-start text-lg">«{entry.description}»</p>
                {entry.variations && (
                    <div className="text-start">
                        <ul className="flex flex-row list-inside gap-12 list-disc">
                            {entry.variations.map((variation, index) => (
                                <li className="" key={index}>
                                    {variation}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {entry.source && (
                    <p className="italic font-[200] text-xs">
                        {entry.source.link ? (
                            <a href={entry.source.link}>{entry.source.name}</a>
                        ) : (
                            entry.source.name
                        )}
                    </p>
                )}
            </div>
        </div>
    );
}
