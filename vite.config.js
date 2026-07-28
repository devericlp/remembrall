import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import path from "path";
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            refresh: true,
        }),
        tailwindcss(),
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            injectRegister: false,
            outDir: 'public/build',
            base: '/build/',
            srcDir: 'resources/js',
            filename: 'service-worker.js',
            strategies: 'injectManifest',
            manifest: {
                name: 'Remembrall',
                short_name: 'Remembrall',
                description: 'Gerenciador de tarefas e lembretes',
                theme_color: '#0B0F15',
                background_color: '#0B0F15',
                display: 'standalone',
                orientation: 'portrait',
                start_url: '/',
                scope: '/',
                icons: [
                    {
                        src: '/images/logo/icon-180.png',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                    {
                        src: '/images/logo/icon-512.png',
                        sizes: '512x512',
                        type: 'image/png',
                    },
                    {
                        src: '/images/logo/icon-512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'maskable',
                    },
                ],
                screenshots: [
                    {
                        src: '/images/logo/icon-1024.png',
                        sizes: '1024x1024',
                        type: 'image/png',
                        form_factor: 'narrow',
                    },
                ],
            },
            injectManifest: {
                globPatterns: ['**/*.{js,css,ico,png,svg,woff2}'],
            },
        }),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "resources/js"),
        },
    },
    server: {
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
    },
});
