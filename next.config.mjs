/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "aceternity.com",
      },
      {
        hostname: "images.unsplash.com",
      },
    ],
  },
  transpilePackages: ["three"],
};

export default nextConfig;
