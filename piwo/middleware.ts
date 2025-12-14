import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import { createI18nMiddleware } from "next-international/middleware";

const I18nMiddleware = createI18nMiddleware({
    locales: ["pl", "en"],
    defaultLocale: "pl",
});

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    // const publicPageRegex = /^\/[a-z]{2}(\/auth(\/(login|signup))?)?\/?$/;
    const privatePageRegex = /^\/[a-z]{2}(\/apps\a?|\/settings?)/;
    // if (publicPageRegex.test(pathname)) {
    //     return i18nResponse;
    // } else {
    //     return sessionResponse;
    // }
    if (privatePageRegex.test(pathname)) {
        const sessionResponse = await updateSession(request);
        sessionResponse.headers.set("x-current-path", request.nextUrl.pathname);
        return sessionResponse;
    } else {
        const i18nResponse = I18nMiddleware(request);
        i18nResponse.headers.set("x-current-path", request.nextUrl.pathname);
        return i18nResponse;
    }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        "/((?!api|_next|.*\\..*).*)",
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|$).*)",
    ],
};
