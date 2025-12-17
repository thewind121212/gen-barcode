import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    // Allow BASE_URL to be set via build arg VITE_BASE_URL (defaults to '/')
    base: env.VITE_BASE_URL || '/',
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@Jade': '/src',
      },
    },
    server: {
      port: 4140,
    },
    preview: {
      port: 4140,
    },
    build: {
      // Split heavy vendor libs to shrink individual chunks
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('@tanstack')) return 'react-query'
              if (id.includes('i18next')) return 'i18n'
              if (id.includes('supertokens')) return 'auth'
              if (id.includes('react-router')) return 'react-router'
              if (id.includes('react-hot-toast')) return 'notifications'
            }
          },
        },
      },
    },
  }
})
