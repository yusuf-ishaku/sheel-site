import { defineConfig } from "vite";
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@web3modal/appkit": "/node_modules/@web3modal/appkit/dist/index.js",
    },
  },
});
