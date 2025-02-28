import { defineConfig } from "vite";

const filename = "kitten-analysts.inject.js";

const KA_RELEASE_CHANNEL = JSON.stringify(process.env.KA_RELEASE_CHANNEL ?? "fixed");
const KA_VERSION = JSON.stringify(process.env.RELEASE_VERSION ?? `${manifest.version}-live`);

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
      external: ["jquery"],
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
    KA_RELEASE_CHANNEL,
    KA_VERSION,
  },
});
