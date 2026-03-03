import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

const isTauri = !!process.env.TAURI_ENV_PLATFORM

export default defineConfig({
  clearScreen: false,
  plugins: [
    react(),
    tailwindcss(),
    ...(!isTauri
      ? [
          VitePWA({
            registerType: 'autoUpdate',
            manifest: {
              name: 'CSV Reader',
              short_name: 'CSV Reader',
              start_url: '/',
              display: 'standalone',
              theme_color: '#ffffff',
              background_color: '#ffffff',
              icons: [
                { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
                { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
              ],
            },
          }),
        ]
      : []),
  ],
  server: {
    strictPort: true,
  },
})
