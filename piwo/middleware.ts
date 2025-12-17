import { chain } from "./middlewares/chain";
import { withI18nMiddleware } from "./middlewares/withI18nMiddleware";
import { withAuthMiddleware } from "./middlewares/withAuthMiddleware";

export default chain([withAuthMiddleware, withI18nMiddleware]);

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
