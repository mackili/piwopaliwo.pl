import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: [
                "/api/",
                "/apps/",
                "/auth/",
                "/settings",
                "/blog/write/",
                "/team/",
            ],
        },
        sitemap: "https://piwopaliwo.pl/sitemap.xml",
    };
}
