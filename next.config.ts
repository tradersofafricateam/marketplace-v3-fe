import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: process.cwd(),
  outputFileTracingIncludes: {
    "/*": [
      "node_modules/sharp/**/*",
      "node_modules/@img/sharp-*/**/*",
      "node_modules/@img/sharp-libvips-*/**/*",
    ],
  },
  turbopack: {
    root: process.cwd(),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
      },
      {
        protocol: "https",

        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "dev.tradersofafrica.com",
      },
    ],
  },
};
const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
