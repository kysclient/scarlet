/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    disableStaticImages: false,
    minimumCacheTTL: 60,
    formats: ['image/webp', 'image/avif'], // 지원하는 확장자 추가
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '**'
      },
      {
        protocol: 'https',
        hostname: 'oaidalleapiprodscus.blob.core.windows.net',
        port: '',
        pathname: '**'
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '',
        pathname: '**'
      }
    ],
    loader: 'default', // next/image의 기본 로더 사용
    path: '/_next/image' // 이미지 경로
  },
  typescript: {
    ignoreBuildErrors: true
  }
}
const withImages = require('next-images');


module.exports = withImages(nextConfig);
