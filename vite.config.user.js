import { defineConfig } from "vite";
import { metablock } from "vite-plugin-userscript";
import manifest from "./package.json" with { type: "json" };

const minify = Boolean(process.env.MINIFY);
const versionString = process.env.RELEASE_VERSION ?? "0.0.0-ci";

const filename = ["kitten-analysts", `-${versionString}`, minify ? ".min" : "", ".user.js"].join(
  "",
);

const RELEASE_CHANNEL = JSON.stringify(process.env.RELEASE_CHANNEL ?? "fixed");
const RELEASE_VERSION = JSON.stringify(versionString);

export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: "source/entrypoint-userscript.ts",
      name: "kitten-analysts",
    },
    minify: minify ? "esbuild" : false,
    outDir: "output",
    rollupOptions: {
      external: ["dojo", "jquery"],
      output: {
        entryFileNames: filename,
        extend: true,
        format: "umd",
      },
    },
    sourcemap: "hidden",
  },
  define: {
    RELEASE_CHANNEL,
    RELEASE_VERSION,
  },
  plugins: [
    metablock({
      manager: "all",
      override: {
        author: manifest.author,
        description: manifest.description,
        homepageURL: manifest.homepage,
        supportURL: manifest.bugs.url,
        version: versionString,
      },
    }),
  ],
});
