import { defineConfig } from "vite";
import manifest from "./package.json" with { type: "json" };

const filename = "kitten-analysts.inject.js";

const RELEASE_CHANNEL = JSON.stringify(process.env.RELEASE_CHANNEL ?? "fixed");
const RELEASE_VERSION = JSON.stringify(process.env.RELEASE_VERSION ?? `${manifest.version}-live`);

export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: "source/entrypoint-userscript.ts",
      name: "kitten-analysts",
    },
    minify: false,
    outDir: "output",
    rollupOptions: {
      external: ["dojo", "jquery"],
      output: {
        extend: true,
        format: "umd",
        entryFileNames: filename,
      },
    },
    sourcemap: "inline",
  },
  define: {
    KA_CONNECT_BACKEND: JSON.stringify(process.env.KA_CONNECT_BACKEND ?? true),
    RELEASE_CHANNEL,
    RELEASE_VERSION,
  },
});
