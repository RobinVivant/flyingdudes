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
  // Ensure CSS modules work correctly
  cssModules: true,
  // Configure for static export
  output: 'export',
  // Configure image loader for static export
  images: {
    loader: 'custom',
    loaderFile: './image-loader.js',
  },
  // Ensure trailing slashes for better static hosting compatibility
  trailingSlash: true,
  // Disable server-based features
  experimental: {
    serverComponents: false,
    serverActions: false,
  },
}

export default nextConfig
