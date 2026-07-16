import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { CustomMiddleware } from "./chain";
import { createI18nMiddleware } from "next-international/middleware";

const I18nMiddleware = createI18nMiddleware({
    locales: ["pl", "en", "cz", "ee"],
    defaultLocale: "pl",
});
const metadataRouteRegex = /^\/(sitemap\.xml|robots\.txt)/;

export function withI18nMiddleware(middleware: CustomMiddleware) {
    return async (
        request: NextRequest,
        event: NextFetchEvent,
        response: NextResponse,
    ) => {
        if (metadataRouteRegex.test(request.nextUrl.pathname)) {
            return middleware(request, event, response);
        }
        const i18nResponse = I18nMiddleware(request);
        i18nResponse.headers.set("x-current-path", request.nextUrl.pathname);
        return middleware(request, event, i18nResponse);
    };
}
