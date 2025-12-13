import LoginPage from "@/components/auth/loginForm";
import { Button } from "@/components/ui/button";
import { getI18n } from "@/locales/server";
import Link from "next/link";

export default async function Page() {
    const t = await getI18n();
    return (
        <div className="flex h-screen justify-center-safe items-center-safe">
            <div className="md:w-100 flex gap-4 flex-col">
                <LoginPage />
                <h4 className="text-center scale-80">{t("or")}</h4>
                <Link href="/auth/signup" className="flex justify-center-safe">
                    <Button className="w-full">{t("register")}</Button>
                </Link>
            </div>
        </div>
    );
}
