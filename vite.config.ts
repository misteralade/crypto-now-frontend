import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'
import { tanstackRouter } from '@tanstack/router-plugin/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
  ],
  optimizeDeps: {
    include: [
      "@material-tailwind/react",
      "@material-tailwind/react/button",
      "@material-tailwind/react/input",
    ],
  },
  resolve: {
    dedupe: ["react"],
  },
  base: "/",
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
    proxy: {
      "/api": {
        target: "https://35.177.5.36:9000",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
})
