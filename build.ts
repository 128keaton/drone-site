import plugin from "bun-plugin-tailwind";
import { $ } from "bun";
import { processGalleryHTML, injectSEOTags } from "./build-utils";

await $`rm -rf docs`;

// Build index.html
await Bun.build({
    entrypoints: ["./index.html"],
    outdir: "docs",
    plugins: [plugin],
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

// Inject SEO tags into index.html
const indexSource = await Bun.file("./docs/index.html").text();
const indexWithSEO = injectSEOTags(indexSource, "index");
await Bun.write("docs/index.html", indexWithSEO);

// Build CSS
await Bun.build({
    entrypoints: ["./styles.css"],
    outdir: "docs",
    plugins: [plugin],
    minify: true,
    naming: {
        entry: "[dir]/index.[ext]",
        chunk: "[name].[ext]",
        asset: "[name].[ext]",
    },
    target: "browser",
    sourcemap: "linked",
    define: {
        "process.env.NODE_ENV": JSON.stringify("production"),
    },
});

// Process and write gallery.html directly
const gallerySource = await Bun.file("./gallery.html").text();
const {
    html: processedGallery,
    imageCount,
    categoryCount,
} = await processGalleryHTML(gallerySource);

// Fix CSS path and inject SEO tags
let galleryWithCSS = processedGallery.replace(
    /href="\.\/styles\.css"/g,
    'href="./index.css"',
);
galleryWithCSS = injectSEOTags(galleryWithCSS, "gallery");
await Bun.write("docs/gallery.html", galleryWithCSS);

// Copy image folders
console.log("✓ Copying image folders...");
await $`cp -r fatdanny2 docs/fatdanny2 2>/dev/null || true`;
await $`cp -r fatdanny docs/fatdanny 2>/dev/null || true`;
await $`cp -r ass_et docs/ass_et 2>/dev/null || true`;

console.log(`✓ Gallery: ${categoryCount} categories with ${imageCount} images`);
console.log("✓ Production build complete");
