import { updateSession } from "@/utils/supabase/proxy";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { CustomMiddleware } from "./chain";

const privatePageRegex =
    /^\/[a-z]{2}(\/apps\a?|\/settings?|\/blog\/write?|\/api?)/;

export function withAuthMiddleware(middleware: CustomMiddleware) {
    return async (
        request: NextRequest,
        event: NextFetchEvent,
        response: NextResponse,
    ) => {
        const { pathname } = request.nextUrl;
        if (privatePageRegex.test(pathname)) {
            const sessionResponse = await updateSession(request);
            const location = sessionResponse.headers.get("location");
            if (
                location &&
                sessionResponse.status >= 300 &&
                sessionResponse.status < 400
            ) {
                return sessionResponse;
            }
            sessionResponse.headers.set(
                "x-current-path",
                request.nextUrl.pathname,
            );

            return middleware(request, event, sessionResponse);
        }
        return middleware(request, event, response);
    };
}
