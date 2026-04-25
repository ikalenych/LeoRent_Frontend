import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("firebase")) return "firebase";
          if (id.includes("framer-motion")) return "motion";
          if (id.includes("lucide-react")) return "lucide";
          if (id.includes("leaflet")) return "map";
          if (
            id.includes("react-dom") ||
            id.includes("react-router-dom") ||
            id.includes("node_modules/react/")
          )
            return "react-vendor";
        },
      },
    },
  },
});
