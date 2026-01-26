import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
    // Configure `pageExtensions` to include markdown and MDX files
    pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
    images: {
        remotePatterns: [
            new URL(
                "https://eyrunfuyksizahrmncam.supabase.co/storage/v1/object/public/**",
            ),
        ],
    },
    allowedDevOrigins: ["192.168.0.31"],
};

const withMDX = createMDX({
    extension: /\.(md|mdx)$/,
    // Add markdown plugins here, as desired
});

export default withMDX(nextConfig);
