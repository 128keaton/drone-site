import plugin from "bun-plugin-tailwind";
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
