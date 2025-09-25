import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import { createI18nMiddleware } from "next-international/middleware";

const I18nMiddleware = createI18nMiddleware({
    locales: ["pl"],
    defaultLocale: "pl",
});

// export async function middleware(request: NextRequest) {
//     I18nMiddleware(request);
//     return await updateSession(request);
// }
export async function middleware(request: NextRequest) {
    const i18nResponse = I18nMiddleware(request);
    const sessionResponse = await updateSession(request);
    const { pathname } = request.nextUrl;
    const publicPageRegex = /^\/[a-z]{2}(\/auth(\/(login|signup))?)?\/?$/;
    if (publicPageRegex.test(pathname)) {
        return i18nResponse;
    } else {
        return sessionResponse;
    }
}
// export async function middleware(request: NextRequest) {
//     // Always run i18n middleware
//     const i18nResponse = I18nMiddleware(request);
//     if (i18nResponse) return i18nResponse;

//     // Only run session middleware for non-main locale pages
//     const { pathname } = request.nextUrl;
//     const mainPageRegex = /^\/[a-z]{2}(\/)?$/;

//     if (!mainPageRegex.test(pathname)) {
//         return await updateSession(request);
//     }
//     // For main locale pages, just continue (no session middleware)
//     return;
// }

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
        // "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|$).*)",
    ],
};
