import { CurrentUserAvatar } from "@/components/current-user-avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserDetails from "./user-details";
import { getI18n } from "@/locales/server";
import { createClient } from "@/utils/supabase/server";
import UserLogin from "./user-login";
import UserSecurity from "./user-security";

export default async function Settings() {
    const t = await getI18n();
    const supabase = await createClient();
    const user = await supabase.auth.getUser();
    return (
        <div className="h-full mt-32 sm:mt-42 min-h-screen flex items-center-safe flex-col gap-12 justify-baseline">
            <CurrentUserAvatar className="w-32 h-32 font-extrabold text-2xl" />
            <Tabs defaultValue="personalInformation">
                <TabsList>
                    <TabsTrigger value="personalInformation">
                        {t("Settings.personalInfo")}
                    </TabsTrigger>
                    <TabsTrigger value="security">
                        {t("Settings.security")}
                    </TabsTrigger>
                    <TabsTrigger value="login" disabled={true}>
                        {t("Settings.login")}
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="personalInformation">
                    <UserDetails user={user} />
                </TabsContent>
                <TabsContent value="security">
                    <UserSecurity user={user} />
                </TabsContent>
                <TabsContent value="login">
                    <UserLogin />
                </TabsContent>
            </Tabs>
        </div>
    );
}
