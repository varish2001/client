import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://server-5yzz.onrender.com",
        changeOrigin: true
      }
    }
  }
});
