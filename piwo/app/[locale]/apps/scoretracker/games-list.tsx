"use server";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import { getCurrentLocale, getI18n } from "@/locales/server";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function ScoredGamesList() {
    const supabase = await createClient();
    const session = await supabase.auth.getUser();
    const t = await getI18n();
    const locale = await getCurrentLocale();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data, error } = await supabase
        .from("UserScore")
        .select("gameId, GameScore(name, status)")
        .filter("userId", "eq", `${session.data.user?.id}`)
        .limit(40);

    return (
        <>
            <h3 className="font-serif text-center">
                {t("ScoreTracker.listOfRecentGames")}
            </h3>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>{t("ScoreTracker.nameOfGame")}</TableHead>
                        <TableHead>{t("ScoreTracker.gameStatus")}</TableHead>
                        <TableHead>{t("ScoreTracker.gameId")}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data &&
                        data.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium">
                                    <Link
                                        href={`/${locale}/apps/scoretracker/${row.gameId}`}
                                    >
                                        {
                                            // @ts-expect-error invalid type inferred by Supabase
                                            row.GameScore.name
                                        }
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    {
                                        // @ts-expect-error invalid type inferred by Supabase
                                        row.GameScore.status
                                    }
                                </TableCell>
                                <TableCell>{row.gameId}</TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </>
    );
}
