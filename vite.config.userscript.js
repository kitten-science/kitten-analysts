import { defineConfig } from "vite";
import { metablock } from "vite-plugin-userscript";
import manifest from "./package.json" with { type: "json" };

const minify = Boolean(process.env.MINIFY);
const versionString = process.env.RELEASE_VERSION ?? "0.0.0-ci";

const filename = ["kitten-analysts", `-${versionString}`, minify ? ".min" : "", ".user.js"].join(
  "",
);

const KA_RELEASE_CHANNEL = JSON.stringify(process.env.KA_RELEASE_CHANNEL ?? "fixed");
const KA_VERSION = JSON.stringify(versionString);

export default defineConfig({
  plugins: [
    metablock({
      override: {
        version: versionString,
        description: manifest.description,
        homepage: manifest.homepage,
        supportURL: manifest.bugs.url,
      },
    }),
  ],
  build: {
    emptyOutDir: false,
    lib: {
      entry: "source/entrypoint-userscript.ts",
      name: "kitten-analysts",
    },
    minify: minify ? "esbuild" : false,
    outDir: "output",
    rollupOptions: {
      external: ["jquery"],
      output: {
        extend: true,
        format: "umd",
        entryFileNames: filename,
      },
    },
  },
  define: {
    KA_RELEASE_CHANNEL,
    KA_VERSION,
  },
});
