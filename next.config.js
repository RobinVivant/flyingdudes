/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    })
    return config
  },
  // Add this to ensure CSS modules work correctly
  cssModules: true,
  // Add this for Cloudflare Pages compatibility
  output: 'standalone',
}

module.exports = nextConfig
