import { TextDocument } from "../markdown-editor/types";
import {
    MDXComponents,
    MDXRemote,
    MDXRemoteOptions,
} from "next-mdx-remote-client/rsc";
import remarkEmoji from "remark-emoji";
import { twMerge } from "tailwind-merge";
import SpotifyEmbed from "./spotify-component";
const options: MDXRemoteOptions = {
    mdxOptions: {
        remarkPlugins: [remarkEmoji],
    },
};
const components: MDXComponents = {
    Spotify: SpotifyEmbed,
};

export default function BlogArticleBody({
    article,
}: {
    article: TextDocument;
}) {
    return (
        <section className="flex justify-center-safe sm:py-8">
            <article
                className={twMerge(
                    "prose prose-zinc prose-light dark:prose-invert prose-beer beer:prose-beer max-w-[1200px] w-full",
                    "md:prose-lg! prose-sm!"
                    // PROSE_STYLING.join(",")
                )}
            >
                <MDXRemote
                    source={article?.markdown || ""}
                    options={options}
                    components={components}
                />
            </article>
        </section>
    );
}
