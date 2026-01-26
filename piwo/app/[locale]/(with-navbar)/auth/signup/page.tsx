import SignUpPage from "@/components/auth/signupForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import GoogleLoginButton from "@/components/auth/google-login-button";
import { getI18n } from "@/locales/server";

export default async function Page() {
    const t = await getI18n();
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
                        <SignUpPage />
                    </CardContent>
                </Card>
                <h4 className="text-center scale-80">{t("or")}</h4>
                <Link href="/auth/login" className="flex justify-center-safe">
                    <Button className="w-full" variant="secondary">
                        {t("logIn")}
                    </Button>
                </Link>
            </div>
        </div>
    );
}
