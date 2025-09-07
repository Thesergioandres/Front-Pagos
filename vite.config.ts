import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  define: {
    global: "window",
  },
  resolve: {
    alias: {
      buffer: "buffer",
      process: "process/browser",
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
        },
      },
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "https://sfjr0up5ok.execute-api.us-east-2.amazonaws.com",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, "/deploy/perdomo-api/api"),
      },
    },
  },
});
