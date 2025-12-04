import { UserResponse } from "@supabase/supabase-js";
import Comments from "./comments";
import { getI18n } from "@/locales/server";
import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";
import LoginPage from "@/components/auth/loginForm";

export default async function CommentSection({
    articleId,
    user,
    ...props
}: {
    articleId: string;
    user: UserResponse;
} & ComponentProps<"div">) {
    const t = await getI18n();
    return (
        <div className={twMerge("mt-8", props?.className)} {...props}>
            <h2>{t("Blog.comments")}</h2>
            {user?.data?.user ? (
                <Comments
                    articleId={articleId}
                    user={user.data.user}
                    showNewComment={true}
                />
            ) : (
                <div className="flex flex-col gap-4 mt-4">
                    {t("Blog.mustLogin")}
                    <LoginPage />
                </div>
            )}
        </div>
    );
}
