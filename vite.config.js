import { defineConfig } from "vite";
import basicSsl from "@vitejs/plugin-basic-ssl";

const useDevTools = process.env.ANALYZE === "1";

export default defineConfig({
  plugins: [
    basicSsl(),
    // Workaround: Skip basicSsl when running devtools to avoid WSS/WS mismatch
    // !useDevTools && basicSsl(),
  ],
  devtools: {
    enabled: useDevTools,
  },
});
