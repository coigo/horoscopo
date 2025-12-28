import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    reactCompiler: true,
    reactStrictMode: true,

    // Otimizações de performance
    compress: true,
    poweredByHeader: false,

    // Segurança: Headers customizados
    async headers() {
        return [
            {
                source: '/:path*',
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
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=()',
                    },
                ],
            },
            // Não cacheia dados sensíveis
            {
                source: '/api/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
                    },
                ],
            },
        ];
    },

    // Reescritas para proteger endpoints
    async rewrites() {
        return {
            beforeFiles: [],
        };
    },

    // Otimizações de imagem
    images: {
        unoptimized: true,
    },

    // ESLint durante build (comentado pois causa erros de tipo)
    // eslint: {
    //   dirs: ['src/pages', 'src/components', 'src/lib'],
    // },
};

export default nextConfig;
