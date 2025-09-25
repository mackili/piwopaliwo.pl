import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import { createI18nMiddleware } from "next-international/middleware";

const I18nMiddleware = createI18nMiddleware({
    locales: ["pl"],
    defaultLocale: "pl",
});

export async function middleware(request: NextRequest) {
    I18nMiddleware(request);
    return await updateSession(request);
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
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|$).*)",
    ],
};
