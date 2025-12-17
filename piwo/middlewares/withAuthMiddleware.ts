import { updateSession } from "@/utils/supabase/middleware";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { CustomMiddleware } from "./chain";

const privatePageRegex = /^\/[a-z]{2}(\/apps\a?|\/settings?)/;

export function withAuthMiddleware(middleware: CustomMiddleware) {
    return async (
        request: NextRequest,
        event: NextFetchEvent,
        response: NextResponse
    ) => {
        const { pathname } = request.nextUrl;
        if (privatePageRegex.test(pathname)) {
            const sessionResponse = await updateSession(request);
            sessionResponse.headers.set(
                "x-current-path",
                request.nextUrl.pathname
            );

            return middleware(request, event, sessionResponse);
        }
        return middleware(request, event, response);
    };
}
