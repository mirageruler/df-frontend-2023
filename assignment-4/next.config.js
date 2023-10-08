/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    disableStaticImages: true,
    domains: ["cdn.pixabay.com"]
  },
}

module.exports = nextConfig
