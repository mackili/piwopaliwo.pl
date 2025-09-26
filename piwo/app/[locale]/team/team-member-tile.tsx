import { getCurrentLocale } from "@/locales/server";
import Link from "next/link";
import Image from "next/image";
import * as z from "zod";
import TeamMemberFacts from "./team-member-facts";
export const PiwoPaliwoTeamMemberSchema = z.object({
    id: z.uuidv4(),
    user_id: z.uuidv4(),
    first_name: z.string(),
    nickname: z.string().nullish(),
    fav_beer: z.string().nullish(),
    education: z.array(z.string()).nullish(),
    bio: z.string().nullish(),
    location: z.string().nullish(),
    image_url: z.url().nullish(),
});

export type PiwoPaliwoTeamMember = z.infer<typeof PiwoPaliwoTeamMemberSchema>;

export default async function TeamMemberTile({
    teamMember,
}: {
    teamMember: PiwoPaliwoTeamMember;
}) {
    const locale = (await getCurrentLocale()) || "pl";
    console.log(teamMember);
    return (
        <div className="aspect-square flex w-full h-full relative transition-all ease-in-out bg-accent overflow-hidden">
            <div className="z-0">
                {teamMember.image_url && (
                    <Image src={teamMember.image_url} fill={true} alt="Image" />
                )}
            </div>
            <Link href={`/${locale}/team/${teamMember.id}`}>
                <div className="w-full h-full absolute flex items-end hover:bg-background/20 transition-all ease-in-out select-none z-20 hover:scale-105 origin-bottom-left">
                    <div className="p-5 grid gap-2">
                        <p className="font-serif font-bold text-5xl pb-2 flex flex-row gap-2 items-baseline">
                            {teamMember.first_name}
                            {teamMember.nickname && (
                                <span className="text-2xl font-medium">
                                    {`(${teamMember.nickname})`}
                                </span>
                            )}
                        </p>
                        <TeamMemberFacts teamMember={teamMember} />
                    </div>
                </div>
            </Link>
        </div>
    );
}
