import { ComponentProps } from "react";
import { PiwoPaliwoTeamMember } from "./team-member-tile";
import { Beer, GraduationCap, MapPin } from "lucide-react";
import { twMerge } from "tailwind-merge";

export default function TeamMemberFacts({
    teamMember,
    className,
    iconClassName,
    ...props
}: {
    teamMember: PiwoPaliwoTeamMember;
    iconClassName?: string;
} & ComponentProps<"p">) {
    return (
        <>
            {teamMember.education && (
                <p
                    className={twMerge("flex flex-row gap-2", className)}
                    {...props}
                >
                    <GraduationCap
                        className={twMerge("shrink-0", iconClassName)}
                    />{" "}
                    <span>{teamMember.education.join("; ")}</span>
                </p>
            )}
            {teamMember.fav_beer && (
                <p
                    className={twMerge("flex flex-row gap-2", className)}
                    {...props}
                >
                    <Beer className={twMerge("shrink-0", iconClassName)} />{" "}
                    <span>{teamMember.fav_beer}</span>
                </p>
            )}
            {teamMember.location && (
                <p
                    className={twMerge("flex flex-row gap-2", className)}
                    {...props}
                >
                    <MapPin className={twMerge("shrink-0", iconClassName)} />
                    <span> {teamMember.location}</span>
                </p>
            )}
        </>
    );
}
