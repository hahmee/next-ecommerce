/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    output: 'standalone', // standalone 설정 추가
    async rewrites() {
        return [
            {
                source: '/apis/:path*',
                destination : `${process.env.NEXT_PUBLIC_BASE_URL}/api/:path*`, // 실제 백엔드 서버 주소
            },
        ];
    },
    images: {
        // domains: ['127.0.0.1'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: `${process.env.AWS_S3_BUCKET}.s3.ap-northeast-2.amazonaws.com`,
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

export default nextConfig;
