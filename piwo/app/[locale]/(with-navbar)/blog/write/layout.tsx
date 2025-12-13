import { redirect } from "next/navigation";
import { getAuthorUser } from "../fetch";
import { getCurrentLocale } from "@/locales/server";

export default async function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const locale = await getCurrentLocale();
    const { isAuthorUser } = await getAuthorUser();
    if (!isAuthorUser) {
        redirect(`/${locale}/blog`);
    }
    return <>{children}</>;
}
