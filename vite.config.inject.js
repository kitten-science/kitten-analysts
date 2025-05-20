import { defineConfig } from "vite";
import manifest from "./package.json" with { type: "json" };

const MINIFY = Boolean(process.env.MINIFY);

const filename = ["kitten-analysts", MINIFY ? ".min" : "", ".inject.js"].join("");

const RELEASE_CHANNEL = JSON.stringify(process.env.RELEASE_CHANNEL ?? "fixed");
const RELEASE_VERSION = JSON.stringify(process.env.RELEASE_VERSION ?? `${manifest.version}-live`);

export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: "source/entrypoint-userscript.ts",
      name: "kitten-analysts",
    },
    minify: MINIFY ? "esbuild" : false,
    outDir: "output",
    rollupOptions: {
      external: ["dojo", "jquery"],
      output: {
        extend: true,
        format: "umd",
        entryFileNames: filename,
      },
    },
    sourcemap: "hidden",
  },
  define: {
    RELEASE_CHANNEL,
    RELEASE_VERSION,
  },
});
