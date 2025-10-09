import { TextDocument } from "../markdown-editor/types";
import { MDXRemote, MDXRemoteOptions } from "next-mdx-remote-client/rsc";
import remarkEmoji from "remark-emoji";
const options: MDXRemoteOptions = {
    mdxOptions: {
        remarkPlugins: [remarkEmoji],
    },
};

export default function BlogArticleBody({
    article,
}: {
    article: TextDocument;
}) {
    return (
        <section>
            <MDXRemote source={article?.markdown || ""} options={options} />
        </section>
    );
}
