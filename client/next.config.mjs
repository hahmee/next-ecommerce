/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        // domains: ['127.0.0.1'],
        remotePatterns: [
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
