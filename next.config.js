/** @type {import('next').NextConfig} */

const nextConfig = {
    output: 'export',
    trailingSlash: true,
    assetPrefix: '',
    images: {
        unoptimized: true,
        domains: ['images.unsplash.com'],
    }
};

module.exports = nextConfig;