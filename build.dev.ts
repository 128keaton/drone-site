import plugin from "bun-plugin-tailwind";
import { $ } from "bun";
import fs from "fs";
import { processGalleryHTML } from "./build-utils";

async function buildDev() {
    console.log("Building for development...");

    // Clean .dev directory
    await $`rm -rf .dev`;

    // Build CSS first
    await Bun.build({
        entrypoints: ["./styles.css"],
        outdir: ".dev",
        plugins: [plugin],
        minify: false,
        sourcemap: "inline",
        define: {
            "process.env.NODE_ENV": JSON.stringify("development"),
        },
    });

    console.log("✓ CSS processed");

    // Process gallery.html directly without bundling
    const gallerySource = await Bun.file("./gallery.html").text();
    const { html: processedGallery } = await processGalleryHTML(gallerySource);
    await Bun.write(".dev/gallery.html", processedGallery);
    console.log("✓ Gallery generated");

    // Build index separately
    await Bun.build({
        entrypoints: ["./index.html"],
        outdir: ".dev",
        plugins: [plugin],
        minify: false,
        sourcemap: "inline",
        define: {
            "process.env.NODE_ENV": JSON.stringify("development"),
        },
    });

    console.log("✓ Index built");

    // Copy image folders to .dev so they're accessible
    console.log("✓ Copying image folders...");
    await $`cp -r fatdanny2 .dev/fatdanny2 2>/dev/null || true`;
    await $`cp -r fatdanny .dev/fatdanny 2>/dev/null || true`;
    await $`cp -r ass_et .dev/ass_et 2>/dev/null || true`;

    console.log("\n✓ Development build complete");
    console.log("  CSS, gallery, and images ready in .dev/");
}

// Check if we're in watch mode
const isWatchMode = process.argv.includes("--watch");

if (isWatchMode) {
    console.log("Starting in watch mode...\n");

    // Initial build
    await buildDev();

    // Start the dev server
    const PORT = 3000;
    console.log(`\n🚀 Starting dev server on http://localhost:${PORT}\n`);

    const server = Bun.serve({
        port: PORT,
        async fetch(req) {
            const url = new URL(req.url);
            let filePath = url.pathname === "/" ? "/index.html" : url.pathname;

            // Try the exact path first
            let fullPath = `.dev${filePath}`;
            try {
                const file = Bun.file(fullPath);
                const exists = await file.exists();
                if (exists) {
                    return new Response(file);
                }
            } catch (e) {
                // File doesn't exist, try alternatives
            }

            // If no extension, try adding .html
            if (!filePath.includes(".")) {
                fullPath = `.dev${filePath}.html`;
                try {
                    const file = Bun.file(fullPath);
                    const exists = await file.exists();
                    if (exists) {
                        return new Response(file);
                    }
                } catch (e) {
                    // File doesn't exist
                }
            }

            return new Response("Not Found", { status: 404 });
        },
    });

    console.log(`Server running. Watching for changes...\n`);

    // Watch for file changes
    const filesToWatch = [
        "index.html",
        "gallery.html",
        "styles.css",
        "plugins",
    ];

    let buildTimeout: Timer | null = null;

    const watchCallback = () => {
        // Debounce rebuilds to avoid multiple builds from rapid file changes
        if (buildTimeout) clearTimeout(buildTimeout);
        buildTimeout = setTimeout(async () => {
            console.log("\n📝 Files changed, rebuilding...");
            try {
                await buildDev();
                console.log("✓ Rebuild complete\n");
            } catch (err) {
                console.error("❌ Build failed:", err);
            }
        }, 300);
    };

    filesToWatch.forEach((file) => {
        fs.watch(file, { recursive: true }, watchCallback);
    });

    console.log(
        "Watching for changes in: index.html, gallery.html, styles.css, plugins/\n",
    );

    // Keep the process running
    process.on("SIGINT", () => {
        console.log("\nShutting down...");
        process.exit(0);
    });
} else {
    // One-time build
    await buildDev();
}
