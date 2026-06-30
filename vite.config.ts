import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import path from "node:path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [preact()],
  resolve: {
    alias: {
      react: "preact/compat",
      "react-dom": "preact/compat",
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    outDir: "dist",
    target: "es2020",
    cssCodeSplit: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  server: {
    host: "127.0.0.1",
    port: 5173,
    proxy: {
      "/api": {
        // Dev: forward /api to the local stats API (api/server.js).
        // Override with VITE_API_TARGET if your API runs elsewhere.
        target: process.env.VITE_API_TARGET ?? "http://127.0.0.1:6670",
        changeOrigin: false,
      },
    },
  },
});
