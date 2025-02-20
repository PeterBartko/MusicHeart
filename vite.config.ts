import { fileURLToPath, URL } from 'node:url';
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import svgLoader from "vite-svg-loader";
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      script: {
        defineModel: true,
      },
    }),
    svgLoader(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Music Heart',
        short_name: 'Music Heart',
        description: 'Tracking and reviewing music albums',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  server: {
    port: 6543,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
