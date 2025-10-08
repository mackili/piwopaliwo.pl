import { createClient } from "@/utils/supabase/server";
import { PiwoPaliwoTeamMember } from "../../team-member-tile";
import { SupabaseError } from "@/utils/supabase/types";
import Image from "next/image";
import { purifiedPost } from "@/components/purified-post";
import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";
import { getCurrentLocale, getI18n } from "@/locales/server";
import Link from "next/link";
import WYSIWYG from "@/components/texteditor/wysiwyg";
import MarkdownEditor from "@/components/markdown-editor/markdown-editor";

export default async function Page({
    params,
    searchParams,
}: {
    params: Promise<{ member: string }>;
    searchParams: Promise<{ id?: string }>;
}) {
    const { member } = await params;
    const searchParameters = await searchParams;
    const supabase = await createClient();
    const t = await getI18n();
    const locale = await getCurrentLocale();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data, error } = (await supabase
        .from("piwo_paliwo_member")
        .select()
        .filter("id", "eq", `${member}`)
        .limit(1)
        .single()) as {
        data: PiwoPaliwoTeamMember | null;
        error: SupabaseError | null;
    };
    const htmlBio = { __html: purifiedPost({ content: data?.bio }) };
    return (
        <section className="relative overflow-ellipsis sm:overflow-visible">
            {/* <WYSIWYG documentId={searchParameters.id} /> */}
            <MarkdownEditor />
        </section>
    );
}
