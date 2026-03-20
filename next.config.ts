import type { NextConfig } from "next";

const supabaseHostname =
  process.env.NEXT_PUBLIC_SUPABASE_DOMAIN ||
  "egtlcpvmpdripuaqypxd.supabase.co";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: supabaseHostname,
      },
    ],
  }
};

export default nextConfig;
