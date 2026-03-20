import plugin from "bun-plugin-tailwind";
import { $ } from "bun";
await $`rm -rf docs`;
await Bun.build({
  entrypoints: ["./index.html"],
  outdir: "docs",
  plugins: [plugin],
  minify: true,

  target: "browser",
  sourcemap: "linked",
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
});
