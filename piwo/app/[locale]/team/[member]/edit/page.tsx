"use server";
import { createClient } from "@/utils/supabase/server";
import { PiwoPaliwoTeamMember } from "../../team-member-tile";
import { SupabaseError } from "@/utils/supabase/types";
import MarkdownEditor from "@/components/markdown-editor/markdown-editor";
import { TextDocument } from "@/components/markdown-editor/types";

export default async function Page({
    params,
}: {
    params: Promise<{ member: string }>;
}) {
    const { member } = await params;
    const supabase = await createClient();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data, error } = (await supabase
        .from("piwo_paliwo_member")
        .select("*,bio_document:TextDocument!piwo_paliwo_member_bio_fkey(*)")
        .filter("id", "eq", `${member}`)
        .limit(1)
        .single()) as {
        data: PiwoPaliwoTeamMember | null;
        error: SupabaseError | null;
    };
    return (
        <section className="overflow-ellipsis sm:overflow-visible h-full">
            <MarkdownEditor
                className="h-full min-h-[600px]"
                textDocument={data?.bio_document as TextDocument | undefined}
            />
        </section>
    );
}
