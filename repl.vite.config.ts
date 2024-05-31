const path = require("path");
const { defineConfig } = require("vite");
import vue from "@vitejs/plugin-vue";

module.exports = defineConfig({
  plugins: [vue()], // to process SFC
  build: {
    lib: {
      entry: {
        libs: path.resolve(__dirname, "repl/index.ts"),
        luxon: path.resolve(__dirname, "repl/luxon.ts"),
      },
      name: "repl-libs",
      formats: ["es"], // adding 'umd' requires globals set to every external module
      fileName: (format: string, entry: string) => `${entry}.${format}.js`,
    },
    rollupOptions: {
      // external modules won't be bundled into your library
      external: ["vue"], // not every external has a global
      output: {
        // disable warning on src/index.ts using both default and named export
        exports: "named",
        // Provide global variables to use in the UMD build
        // for externalized deps (not useful if 'umd' is not in lib.formats)
        globals: {
          vue: "Vue",
        },
      },
    },
    emptyOutDir: true, // to retain the types folder generated by tsc
    outDir: path.resolve(__dirname, "docs/public/repl"),
    minify: "terser",
  },
  resolve: {
    alias: {
      "@jakguru/vueprint-components": path.resolve(__dirname, "src"),
    },
  },
});
