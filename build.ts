import plugin from "bun-plugin-tailwind";
import { $ } from "bun";
await $`rm -rf docs`;
await Bun.build({
  entrypoints: ["./index.html"],
  outdir: "docs",
  plugins: [plugin],
  minify: true,
  naming: {
    // default values
    entry: "[dir]/[name].[ext]",
    chunk: "[name].[ext]",
    asset: "[name].[ext]",
  },
  target: "browser",
  sourcemap: "linked",
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
});
