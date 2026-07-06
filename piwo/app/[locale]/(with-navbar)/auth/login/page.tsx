import GoogleLoginButton from "@/components/auth/google-login-button";
import LoginPage from "@/components/auth/loginForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getI18n, getStaticParams } from "@/locales/server";
import { setStaticParamsLocale } from "next-international/server";
import Link from "next/link";

export function generateStaticParams() {
    return getStaticParams();
}

export default async function Page({
    params,
    searchParams,
}: {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ returnUrl?: string }>;
}) {
    const [{ locale }, { returnUrl }] = await Promise.all([
        params,
        searchParams,
    ]);
    setStaticParamsLocale(locale);
    const t = await getI18n();
    const signupHref = returnUrl
        ? `/auth/signup?returnUrl=${encodeURIComponent(returnUrl)}`
        : "/auth/signup";
    return (
        <div className="flex h-screen justify-center-safe items-center-safe">
            <div className="md:w-100 flex gap-4 flex-col">
                <Card>
                    <CardContent className="flex w-full justify-center">
                        <GoogleLoginButton context="signin_with" />
                    </CardContent>
                </Card>
                <h4 className="text-center scale-80">{t("or")}</h4>
                <Card>
                    <CardContent>
                        <LoginPage returnUrl={returnUrl} />
                    </CardContent>
                </Card>
                <h4 className="text-center scale-80">{t("or")}</h4>
                <Link href={signupHref} className="flex justify-center-safe">
                    <Button className="w-full">{t("register")}</Button>
                </Link>
            </div>
        </div>
    );
}
