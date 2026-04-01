import plugin from "bun-plugin-tailwind";
import galleryPlugin from "./plugins/gallery-plugin";
import { $ } from "bun";

await $`rm -rf docs`;

// Build index.html
await Bun.build({
    entrypoints: ["./index.html"],
    outdir: "docs",
    plugins: [galleryPlugin, plugin],
    minify: true,
    naming: {
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

// Build gallery.html
const galleryBuild = await Bun.build({
    entrypoints: ["./gallery.html"],
    outdir: "docs",
    plugins: [galleryPlugin, plugin],
    minify: true,
    naming: {
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

// Extract gallery.html from the gallery.js bundle and write it as static HTML
const galleryJs = await Bun.file("docs/gallery.js").text();
const match = galleryJs.match(/var\s+\w+=`([\s\S]*?)`/);

if (match && match[1]) {
    const html = match[1];
    await Bun.write("docs/gallery.html", html);
    await $`rm docs/gallery.js docs/gallery.js.map 2>/dev/null || true`;
}

console.log("✓ Production build complete");
