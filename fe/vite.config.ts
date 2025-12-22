import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // In some sandboxed environments `.env.local` may be unreadable (ignored file),
  // so we fall back to process.env to keep builds working.
  let env: Record<string, string> = {}
  try {
    env = loadEnv(mode, process.cwd(), '')
  } catch {
    env = process.env as unknown as Record<string, string>
  }
  return {
    // Base path for assets: prefer VITE_BASE_URL, then VITE_WEBSITE_BASE_URL, fallback '/'
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
              if (id.includes('lucide-react/dist/esm/icons/')) {
                const iconName = id.split('/icons/')[1]?.split('.')[0] || 'icon'
                const bucket = iconName.charAt(0).toLowerCase() || 'icon'
                return `icons-${bucket}`
              }
              // Keep the dynamic map small; don't force its own chunk
              if (id.includes('lucide-react/dynamicIconImports')) return
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
