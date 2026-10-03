/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  // Core's API host for the CMS image bridge (src/app/api/cms-media). The image
  // build sets API_BASE_URL per environment; the running site has no
  // API_BASE_URL of its own, so the value is fixed at build time.
  env: { CORE_API_ORIGIN: process.env.API_BASE_URL ?? "" },
};

export default nextConfig;
