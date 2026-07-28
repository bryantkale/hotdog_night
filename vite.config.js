import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig({
    plugins: [react(), basicSsl()],
    base: "/",
    build: {
        outDir: "dist",
        assetsDir: "assets",
        emptyOutDir: true,
    },
    server: {
        host: "0.0.0.0",
        port: 3000,
        strictPort: true,
        https: false,
    },
    preview: {
        host: "0.0.0.0",
        port: 3000,
        strictPort: true,
        https: false,
    },
});
