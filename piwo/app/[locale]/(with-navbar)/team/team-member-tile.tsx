import { getCurrentLocale } from "@/locales/server";
import Link from "next/link";
import Image from "next/image";
import * as z from "zod";
import TeamMemberFacts from "./team-member-facts";
import { TextDocumentSchema } from "@/components/markdown-editor/types";
export const PiwoPaliwoTeamMemberSchema = z.object({
    id: z.uuidv4(),
    user_id: z.uuidv4(),
    first_name: z.string(),
    nickname: z.string().nullish(),
    fav_beer: z.string().nullish(),
    education: z.array(z.string()).nullish(),
    bio: z.uuid().nullish(),
    location: z.string().nullish(),
    image_url: z.url().nullish(),
    bio_document: TextDocumentSchema.nullish(),
});

export type PiwoPaliwoTeamMember = z.infer<typeof PiwoPaliwoTeamMemberSchema>;

export default async function TeamMemberTile({
    teamMember,
}: {
    teamMember: PiwoPaliwoTeamMember;
}) {
    const locale = (await getCurrentLocale()) || "pl";
    return (
        <div className="aspect-square flex w-full h-full relative transition-all ease-in-out bg-accent overflow-hidden">
            <div className="z-0">
                {teamMember.image_url && (
                    <Image src={teamMember.image_url} fill={true} alt="Image" />
                )}
            </div>
            <Link href={`/${locale}/team/${teamMember.id}`}>
                <div className="w-full h-full absolute flex items-end transition-all ease-in-out select-none z-20 hover:scale-102 origin-bottom-left">
                    <div className="p-2 px-4 md:p-5 grid gap-1 md:gap-2 text-secondary dark:text-primary bg-radial backdrop-blur-xs rounded-2xl outline outline-sidebar/10 shadow-xs m-2 max-w-[300px]">
                        <p className="font-serif font-bold text-2xl md:text-4xl pb-1 flex flex-row gap-2 items-baseline">
                            {teamMember.first_name}
                            {teamMember.nickname && (
                                <span className="text-base md:text-xl font-medium ">
                                    {`(${teamMember.nickname})`}
                                </span>
                            )}
                        </p>
                        <TeamMemberFacts
                            teamMember={teamMember}
                            className="text-xs md:text-sm"
                            iconClassName="max-sm:h-4"
                        />
                    </div>
                </div>
            </Link>
        </div>
    );
}
