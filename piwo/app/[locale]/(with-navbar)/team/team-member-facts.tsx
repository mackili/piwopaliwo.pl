import { PiwoPaliwoTeamMember } from "./team-member-tile";
import { Beer, GraduationCap, MapPin } from "lucide-react";

export default function TeamMemberFacts({
    teamMember,
}: {
    teamMember: PiwoPaliwoTeamMember;
}) {
    return (
        <>
            {teamMember.education && (
                <p className="flex flex-row gap-2">
                    <GraduationCap className="shrink-0" />{" "}
                    <span>{teamMember.education.join("; ")}</span>
                </p>
            )}
            {teamMember.fav_beer && (
                <p className="flex flex-row gap-2">
                    <Beer className="shrink-0" />{" "}
                    <span>{teamMember.fav_beer}</span>
                </p>
            )}
            {teamMember.location && (
                <p className="flex flex-row gap-2">
                    <MapPin className="shrink-0" />
                    <span> {teamMember.location}</span>
                </p>
            )}
        </>
    );
}
