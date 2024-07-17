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
  // Add this for static export
  output: 'export',
  // Configure image loader for static export
  images: {
    loader: 'custom',
    loaderFile: './image-loader.js',
  },
  trailingSlash: true,
}

module.exports = nextConfig
