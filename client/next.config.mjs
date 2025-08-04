import withBundleAnalyzer from '@next/bundle-analyzer';

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    output: 'standalone', // standalone 설정 추가
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: `${process.env.NEXT_PUBLIC_AWS_S3_BUCKET}.s3.ap-northeast-2.amazonaws.com`,
                port: '',
                pathname: '/**',
            },
            {
                protocol: "https",
                hostname: "images.pexels.com",
            },
            {
                protocol: "http",
                hostname: '**',
                port: '8080',
            },
        ],
    },
};


export default withBundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
})(nextConfig);