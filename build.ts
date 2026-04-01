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
const startMatch = galleryJs.indexOf("`");
const endMatch = galleryJs.lastIndexOf("`");

if (startMatch !== -1 && endMatch !== -1 && startMatch < endMatch) {
    let html = galleryJs.substring(startMatch + 1, endMatch);

    // Fix CSS path - use ./index.css instead of ./styles.css
    html = html.replace(/href="\.\/styles\.css"/g, 'href="./index.css"');

    await Bun.write("docs/gallery.html", html);
    await $`rm docs/gallery.js docs/gallery.js.map 2>/dev/null || true`;
}

// Copy image folders to docs so they're accessible
console.log("✓ Copying image folders...");
await $`cp -r fatdanny2 docs/fatdanny2 2>/dev/null || true`;
await $`cp -r fatdanny docs/fatdanny 2>/dev/null || true`;
await $`cp -r poop docs/poop 2>/dev/null || true`;

console.log("✓ Production build complete");
