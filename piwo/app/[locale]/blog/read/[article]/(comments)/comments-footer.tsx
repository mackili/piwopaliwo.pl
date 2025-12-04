import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { CommentQueryParameters } from "./comments";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/locales/client";

function calculateOffset(offset: number, limit: number) {
    const modulo = offset % limit;
    return Math.max(offset - modulo, 0);
}

export default function CommentsFooter({
    totalCommentCount = 0,
    parameters,
    onChange,
}: {
    totalCommentCount: number;
    parameters: CommentQueryParameters;
    onChange: (params: CommentQueryParameters) => void;
}) {
    const t = useI18n();
    function changeLimit(newLimit: number) {
        if (newLimit !== parameters.limit) {
            onChange({
                limit: newLimit,
                offset: calculateOffset(parameters.offset, newLimit),
            });
        }
    }
    function changeOffset(newOffset: number) {
        console.log([newOffset, parameters.offset]);
        if (newOffset !== parameters.offset) {
            onChange({
                limit: parameters.limit,
                offset: newOffset,
            });
        }
    }
    const offsets = () => {
        let i = 1;
        let lim = 0;
        const offsetCount = Math.ceil(totalCommentCount / parameters.limit);
        const result = [];
        while (i <= offsetCount) {
            result.push({
                offset: lim,
                order: i,
                from: lim,
                to: Math.min(lim + parameters.limit - 1, totalCommentCount),
            });
            lim = lim + parameters.limit;
            i++;
        }
        return result;
    };
    const currentOffset = offsets().find(
        (el) => el.offset === parameters.offset
    );
    return (
        <div className="flex flex-col sm:flex-row-reverse flex-wrap w-full justify-between">
            <div className="flex flex-row gap-2 justify-center grow flex-wrap">
                {offsets()
                    .sort((a, b) => a.offset - b.offset)
                    .map((res, index) => (
                        <Button
                            onClick={() => changeOffset(res.offset)}
                            key={index}
                            type="button"
                            variant={
                                res.offset === currentOffset?.offset
                                    ? "secondary"
                                    : "outline"
                            }
                            size="icon"
                        >
                            {res.order}
                        </Button>
                    ))}
            </div>
            <div className="flex flex-row flex-nowrap items-center gap-2 text-sm font-serif">
                {t("Blog.displayPerPage")}:
                <Select onValueChange={(val) => changeLimit(Number(val))}>
                    <SelectTrigger size="sm">
                        <SelectValue
                            defaultValue={parameters.limit}
                            placeholder={parameters.limit}
                        />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>
                                {t("Blog.displayPerPage")}
                            </SelectLabel>
                            <SelectItem value="5">5</SelectItem>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
