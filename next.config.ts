import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  serverExternalPackages: [
    '@stellar/stellar-sdk',
    '@stellar/stellar-base',
    'sodium-native',
    'require-addon',
  ],
};

export default nextConfig;
