/** @type {import('next').NextConfig} */

const nextConfig = {
    output: 'export',
    trailingSlash: true,
    assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
    images: {
        unoptimized: true,
        domains: ['images.unsplash.com'],
    },
    // Enable standalone output for Docker
    output: process.env.DOCKER_BUILD ? 'standalone' : 'export',
    // Cross-platform compatibility
    experimental: {
        outputFileTracingRoot: process.platform === 'win32' ? undefined : undefined,
    },
    // Environment-specific configurations
    env: {
        CUSTOM_KEY: process.env.CUSTOM_KEY,
    },
    // Headers for better cross-platform compatibility
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block',
                    },
                ],
            },
        ];
    },
};

module.exports = nextConfig;