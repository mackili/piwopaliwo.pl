import { NextFetchEvent, NextRequest } from "next/server";
import { CustomMiddleware } from "./chain";
import { createI18nMiddleware } from "next-international/middleware";

const I18nMiddleware = createI18nMiddleware({
    locales: ["pl", "en", "cz", "ee"],
    defaultLocale: "pl",
});

export function withI18nMiddleware(middleware: CustomMiddleware) {
    return async (
        request: NextRequest,
        event: NextFetchEvent
        // response: NextResponse
    ) => {
        const i18nResponse = I18nMiddleware(request);
        i18nResponse.headers.set("x-current-path", request.nextUrl.pathname);
        return middleware(request, event, i18nResponse);
    };
}
