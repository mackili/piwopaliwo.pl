import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: "https://piwopaliwo.pl",
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1,
            alternates: {
                languages: {
                    pl: "https://piwopaliwo.pl/pl",
                    en: "https://piwopaliwo.pl/en",
                    cs: "https://piwopaliwo.pl/cz",
                    ee: "https://piwopaliwo.pl/ee",
                },
            },
        },
        {
            url: "https://piwopaliwo.pl/team",
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.6,
            alternates: {
                languages: {
                    pl: "https://piwopaliwo.pl/pl/team",
                    en: "https://piwopaliwo.pl/en/team",
                    cs: "https://piwopaliwo.pl/cz/team",
                    ee: "https://piwopaliwo.pl/ee/team",
                },
            },
        },
        {
            url: "https://piwopaliwo.pl/blog",
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
            alternates: {
                languages: {
                    pl: "https://piwopaliwo.pl/pl/blog",
                    en: "https://piwopaliwo.pl/en/blog",
                    cs: "https://piwopaliwo.pl/cz/blog",
                    ee: "https://piwopaliwo.pl/ee/blog",
                },
            },
        },
    ];
}
