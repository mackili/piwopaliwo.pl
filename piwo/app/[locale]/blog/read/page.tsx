import { getCurrentLocale } from "@/locales/server";
import { redirect } from "next/navigation";

export default async function Page() {
    const locale = await getCurrentLocale();
    redirect(`/${locale}/blog`);
}
