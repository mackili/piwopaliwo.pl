"use server";
import { getCurrentLocale, getI18n } from "@/locales/server";
import { SupabaseError } from "@/utils/supabase/types";
import { createClient } from "@/utils/supabase/server";
import TeamMemberTile, { PiwoPaliwoTeamMember } from "./team-member-tile";
import Link from "next/link";

export default async function TeamSection() {
    const t = await getI18n();
    const locale = await getCurrentLocale();
    const supabase = await createClient();
    const { data, error } = (await supabase
        .from("piwo_paliwo_member")
        .select()) as {
        data: PiwoPaliwoTeamMember[] | null;
        error: SupabaseError | null;
    };
    return (
        <div className="flex flex-col gap-8 sm:gap-12 w-full">
            <Link href={`/${locale}/team`}>
                <header>{t("team")}</header>
            </Link>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-1 grid-flow-row w-full">
                {error
                    ? error.message
                    : data &&
                      data.map((member, index) => (
                          <TeamMemberTile key={index} teamMember={member} />
                      ))}
            </div>
        </div>
    );
}
