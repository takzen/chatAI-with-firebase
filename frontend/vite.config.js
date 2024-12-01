import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    open: true, // Otwiera przeglądarkę automatycznie
    // Możesz dodać inne opcje konfiguracji serwera tutaj, jeśli są potrzebne
    port: 5173, // Domyślny port
    host: "127.0.0.1", // Adres hosta
    cors: {
      origin: "*", // pozwala na dostęp z każdej domeny
    },
  },
});
