import { UserResponse } from "@supabase/supabase-js";
import Comments from "./comments";

export default function CommentSection({
    articleId,
    user,
}: {
    articleId: string;
    user: UserResponse;
}) {
    return user.data.user ? (
        <div>
            <h2>Comments</h2>
            <Comments articleId={articleId} user={user.data.user} />
        </div>
    ) : (
        <div></div>
    );
}
