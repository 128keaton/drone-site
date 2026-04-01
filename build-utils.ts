import { readdir } from "fs/promises";
import { extname } from "path";
import { generateMetaTags } from "./seo-config";

export interface GallerySection {
    id: string;
    title: string;
    description: string;
    directory: string;
    youtubeId?: string;
}

export interface GalleryImage {
    src: string;
    alt: string;
}

const GALLERY_SECTIONS: GallerySection[] = [
    {
        id: "real-estate",
        title: "Real Estate",
        description:
            "Professional aerial photography for property showcases and development projects.",
        directory: "asset/real-estate",
    },
    {
        id: "general",
        title: "General",
        description:
            "Beautiful aerial landscapes and scenic views captured from the sky.",
        directory: "asset/general",
    },
    {
        id: "night-time",
        title: "Night Time",
        description:
            "Stunning twilight and evening shots capturing the magic of dusk and night.",
        directory: "asset/night-time",
    },
    {
        id: "cinematography",
        title: "Dynamic Cinematography",
        description:
            "High-quality drone videography and cinematic footage showcasing the art of aerial cinematography.",
        directory: "asset",
        youtubeId: "3Bl_jzsg4cM",
    },
];

const SUPPORTED_EXTENSIONS = new Set([
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".gif",
]);

export async function getImagesFromDirectory(
    dirPath: string,
): Promise<GalleryImage[]> {
    try {
        const files = await readdir(dirPath);
        const images: GalleryImage[] = [];

        for (const file of files) {
            const ext = extname(file).toLowerCase();
            if (SUPPORTED_EXTENSIONS.has(ext)) {
                images.push({
                    src: `./${dirPath}/${file}`,
                    alt: file.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " "),
                });
            }
        }

        return images.sort((a, b) => a.src.localeCompare(b.src));
    } catch (error) {
        console.warn(`Could not read directory ${dirPath}:`, error);
        return [];
    }
}

function generateGalleryCard(image: GalleryImage): string {
    return `
                        <div class="card bg-base-100 shadow-xl transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl overflow-hidden">
                            <button class="focus:outline-none group gallery-item" type="button">
                                <figure class="overflow-hidden aspect-4/3">
                                    <img
                                        src="${image.src}"
                                        alt="${image.alt}"
                                        loading="lazy"
                                        decoding="async"
                                        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02] cursor-pointer"
                                    />
                                </figure>
                            </button>
                        </div>`;
}

function generateGallerySection(
    section: GallerySection,
    images: GalleryImage[],
): string {
    const cards = images.map(generateGalleryCard).join("\n");

    return `
                    <section id="${section.id}" class="py-16 bg-base-300 scroll-mt-20 w-full">
                <div class="mx-auto max-w-6xl px-6">
                    <div class="mb-12">
                        <div class="inline-block">
                            <h2 class="text-3xl sm:text-4xl font-bold">${section.title}</h2>
                            <div class="mt-3 h-1 w-24 bg-linear-to-r from-primary to-secondary"></div>
                        </div>
                        <p class="mt-4 text-base-content/70 max-w-2xl">${section.description}</p>
                    </div>
                    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
${cards}
                    </div>
                </div>
                    </section>`;
}

function generateCinematographySection(section: GallerySection): string {
    return `
                    <section id="${section.id}" class="py-16 bg-base-200 scroll-mt-32 lg:scroll-mt-16 w-full lg:mx-4 lg:mt-4 lg:mb-4 lg:rounded-lg lg:border lg:border-base-content/20">
                <div class="mx-auto max-w-6xl px-6">
                    <div class="mb-12">
                        <div class="inline-block">
                            <h2 class="text-3xl sm:text-4xl font-bold">${section.title}</h2>
                            <div class="mt-3 h-1 w-24 bg-linear-to-r from-secondary to-primary"></div>
                        </div>
                        <p class="mt-4 text-base-content/70 max-w-2xl">${section.description}</p>
                    </div>
                    <div class="aspect-video w-full rounded-lg overflow-hidden shadow-2xl bg-base-300 flex items-center justify-center">
                        <iframe
                            class="w-full h-full"
                            src="https://www.youtube.com/embed/${section.youtubeId}"
                            title="${section.title}"
                            frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerpolicy="strict-origin-when-cross-origin"
                            allowfullscreen
                        ></iframe>
                    </div>
                </div>
                    </section>`;
}

function generateNavigation(sections: GallerySection[]): string {
    return sections
        .map(
            (section) =>
                `                        <li>
                            <a href="#${section.id}" class="link link-hover text-sm">${section.title}</a>
                        </li>`,
        )
        .join("\n");
}

function generateMobileNavigation(sections: GallerySection[]): string {
    return sections
        .map(
            (section) =>
                `                    <a href="#${section.id}" class="btn btn-sm btn-ghost">${section.title}</a>`,
        )
        .join("\n");
}

export async function processGalleryHTML(
    htmlSource: string,
): Promise<{ html: string; imageCount: number; categoryCount: number }> {
    const gallerySections: string[] = [];
    const navSections: GallerySection[] = [];

    for (const section of GALLERY_SECTIONS) {
        if (section.youtubeId) {
            // For cinematography section, just add it without checking images
            gallerySections.push(generateCinematographySection(section));
            navSections.push(section);
        } else {
            const images = await getImagesFromDirectory(section.directory);
            if (images.length > 0) {
                gallerySections.push(generateGallerySection(section, images));
                navSections.push(section);
            }
        }
    }

    let processed = htmlSource.replace(
        /<!-- GALLERY_SECTIONS_START -->[\s\S]*?<!-- GALLERY_SECTIONS_END -->/,
        `<!-- GALLERY_SECTIONS_START -->
${gallerySections.join("\n")}
                    <!-- GALLERY_SECTIONS_END -->`,
    );

    processed = processed.replace(
        /<!-- GALLERY_NAV_START -->[\s\S]*?<!-- GALLERY_NAV_END -->/,
        `<!-- GALLERY_NAV_START -->
${generateNavigation(navSections)}
                        <!-- GALLERY_NAV_END -->`,
    );

    processed = processed.replace(
        /<!-- GALLERY_MOBILE_NAV_START -->[\s\S]*?<!-- GALLERY_MOBILE_NAV_END -->/,
        `<!-- GALLERY_MOBILE_NAV_START -->
${generateMobileNavigation(navSections)}
                    <!-- GALLERY_MOBILE_NAV_END -->`,
    );

    const imageCount = gallerySections.reduce(
        (sum, s) => sum + (s.match(/<button/g)?.length || 0),
        0,
    );

    return {
        html: processed,
        imageCount,
        categoryCount: navSections.length,
    };
}

export function injectSEOTags(htmlSource: string, pageKey: string): string {
    const metaTags = generateMetaTags(pageKey);

    // Replace the head content with injected SEO tags
    return htmlSource.replace(
        /<head>([\s\S]*?)<\/head>/,
        `<head>
    ${metaTags}
    ${htmlSource.match(/<head>([\s\S]*?)<\/head>/)?.[1] || ""}
</head>`,
    );
}
