"use client";
import { Spotify } from "mdx-embed";
import { ISpotifyProps } from "mdx-embed/dist/types/components/spotify/spotify";

export default function SpotifyEmbed({ ...props }: ISpotifyProps) {
    return (
        <div className="p-2 bg-white rounded-xl">
            <Spotify {...props} width="100%" height={152} />
        </div>
    );
}
