import SignUpPage from "@/components/auth/signupForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import GoogleLoginButton from "@/components/auth/google-login-button";
import { getI18n } from "@/locales/server";
import { setStaticParamsLocale } from "next-international/server";

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
    const loginHref = returnUrl
        ? `/auth/login?returnUrl=${encodeURIComponent(returnUrl)}`
        : "/auth/login";
    return (
        <div className="flex h-screen justify-center-safe items-center-safe">
            <div className="md:w-100 flex gap-4 flex-col">
                <Card>
                    <CardContent className="flex w-full justify-center">
                        <GoogleLoginButton context="signup_with" />
                    </CardContent>
                </Card>
                <h4 className="text-center scale-80">{t("or")}</h4>
                <Card>
                    <CardContent>
                        <SignUpPage returnUrl={returnUrl} />
                    </CardContent>
                </Card>
                <h4 className="text-center scale-80">{t("or")}</h4>
                <Link href={loginHref} className="flex justify-center-safe">
                    <Button className="w-full" variant="secondary">
                        {t("logIn")}
                    </Button>
                </Link>
            </div>
        </div>
    );
}
