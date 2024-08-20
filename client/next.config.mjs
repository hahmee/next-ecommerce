/** @type {import('next').NextConfig} */
const nextConfig = {
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
