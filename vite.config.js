import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base: './' keeps the built site portable — it works from a GitHub Pages
// project subpath, any static host, or straight off the filesystem, with no
// server config.
export default defineConfig({
  base: './',
  // The bundler's own output moves to dist/build/ so that it cannot collide
  // with public/assets/ — the artwork folder, which is addressed by hand as
  // /assets/<theme>/<slot>.png and has to keep that name.
  build: { assetsDir: 'build' },
  plugins: [react(), tailwindcss()],
})
