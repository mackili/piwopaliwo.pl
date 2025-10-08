import { createClient } from "@/utils/supabase/server";
import { PiwoPaliwoTeamMember } from "../team-member-tile";
import { SupabaseError } from "@/utils/supabase/types";
import Image from "next/image";
import TeamMemberFacts from "../team-member-facts";
import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";
import { getCurrentLocale, getI18n } from "@/locales/server";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote-client/rsc";

export default async function Page({
    params,
}: {
    params: Promise<{ member: string }>;
}) {
    const { member } = await params;
    const supabase = await createClient();
    const t = await getI18n();
    const locale = await getCurrentLocale();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data, error } = (await supabase
        .from("piwo_paliwo_member")
        .select(
            "*, bio_document:TextDocument!piwo_paliwo_member_bio_fkey(*,sections:TextDocumentSection(*))"
        )
        .filter("id", "eq", `${member}`)
        .limit(1)
        .single()) as {
        data: PiwoPaliwoTeamMember | null;
        error: SupabaseError | null;
    };
    console.log(data);
    return (
        <section className="relative overflow-ellipsis sm:overflow-visible">
            {data && (
                <div className="flex flex-col sm:grid sm:grid-cols-11 relative left-0 top-0 w-full items-start justify-start sm:justify-end-safe sm:gap-8">
                    <div className="w-screen sm:w-full min-w-[350px] sm:col-span-5 aspect-square -left-5 sm:-top-42! sm:left-10 -top-24 relative">
                        {data?.image_url && (
                            <Image
                                className="sm:absolute -z-5"
                                src={data?.image_url}
                                alt=""
                                fill={true}
                            />
                        )}
                    </div>
                    <div className="sm:order-first sm:col-span-6 w-full flex flex-col gap-4 px-4 -top-48 sm:top-0 sm:pr-0 justify-end-safe relative">
                        <header className="sm:overflow-x-visible sm:whitespace-nowrap">
                            {data?.first_name}{" "}
                            <span className="font-bold text-6xl">
                                {data?.nickname && `(${data.nickname})`}
                            </span>
                        </header>
                        <div className="flex flex-col gap-2 sm:flex-row sm:justify-between flex-wrap">
                            <TeamMemberFacts teamMember={data} />
                        </div>
                        {data.user_id ===
                            (await supabase.auth.getUser()).data.user?.id && (
                            <Link
                                href={`/${locale}/team/${member}/edit?id=${data?.bio}`}
                                className="w-full"
                            >
                                <Button variant="outline" className="w-full">
                                    <span className="flex flex-row gap-2 items-center-safe">
                                        <PencilIcon /> {`${t("edit")} BIO`}
                                    </span>
                                </Button>
                            </Link>
                        )}
                        {data?.bio && data?.bio_document && (
                            <div className="w-full pt-10 text-justify text-pretty text-base/6 font-light tracking-wide flex gap-4 flex-col">
                                <MDXRemote
                                    source={data.bio_document?.markdown || ""}
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}
