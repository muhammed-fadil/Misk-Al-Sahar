import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    watch: {
      // json-server rewrites db.json on every change; without this the
      // Vite dev server full-reloads the app and interrupts navigation.
      ignored: ["**/db.json"],
    },
  },
});