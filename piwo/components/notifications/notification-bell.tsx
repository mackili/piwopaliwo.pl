import { createClient } from "@/utils/supabase/server";
import NotificationBellDropdown from "./notification-bell-dropdown";

export default async function NotificationBell() {
    const supabase = await createClient();
    const userId = (await supabase.auth.getUser()).data?.user?.id;
    return userId && <NotificationBellDropdown userId={userId} />;
}
