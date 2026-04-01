import { concatArrayBuffers } from "bun";

export interface SEOConfig {
    title: string;
    description: string;
    keywords?: string[];
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    ogType?: string;
    twitterCard?: string;
    twitterTitle?: string;
    twitterDescription?: string;
    twitterImage?: string;
    canonical?: string;
    author?: string;
    robots?: string;
}

export const defaultSEO: SEOConfig = {
    title: "Mid-South Sky | Aerial Photography & Drone Services",
    description:
        "Professional aerial photography and drone services across the Mid-South. Real estate, landscape, and cinematography expertise.",
    keywords: [
        "aerial photography",
        "drone services",
        "aerial videography",
        "real estate photography",
        "mid-south",
        "drone",
        "landscape photography",
        "cinematography",
    ],
    ogTitle: "Mid-South Sky | Aerial Photography & Drone Services",
    ogDescription:
        "Professional aerial photography and drone services across the Mid-South.",
    ogType: "website",
    twitterCard: "summary_large_image",
    author: "Mid-South Sky",
    robots: "index, follow",
};

export const pageConfigs: Record<string, SEOConfig> = {
    index: {
        ...defaultSEO,
        title: "Give us a fly! | Mid-South Sky",
        description:
            "Professional aerial photography and drone services across the Mid-South. Real estate, landscape, and cinematography expertise.",
        ogTitle: "Give us a fly! | Mid-South Sky",
        ogDescription:
            "Professional aerial photography and drone services across the Mid-South.",
        canonical: "https://midsouthsky.com",
    },
    gallery: {
        title: "Gallery | Mid-South Sky",
        description:
            "Explore our portfolio of aerial photography across real estate, general landscapes, and cinematography. Professional drone services.",
        keywords: [
            "aerial photography gallery",
            "drone photography portfolio",
            "real estate aerial photos",
            "landscape photography",
            "night photography",
        ],
        ogTitle: "Gallery | Mid-South Sky",
        ogDescription:
            "Explore our portfolio of professional aerial photography and drone services.",
        ogType: "website",
        twitterCard: "summary_large_image",
        author: "Mid-South Sky",
        robots: "index, follow",
        canonical: "https://midsouthsky.com/gallery",
    },
};

export function generateMetaTags(pageKey: string): string {
    const config = pageConfigs[pageKey] || defaultSEO;

    const tags: string[] = [
        `<meta charset="UTF-8" />`,
        `<meta name="viewport" content="width=device-width, initial-scale=1" />`,
        `<title>${escapeHtml(config.title)}</title>`,
        `<meta name="description" content="${escapeHtml(config.description)}" />`,
    ];

    if (config.keywords && config.keywords.length > 0) {
        tags.push(
            `<meta name="keywords" content="${escapeHtml(config.keywords.join(", "))}" />`,
        );
    }

    if (config.author) {
        tags.push(
            `<meta name="author" content="${escapeHtml(config.author)}" />`,
        );
    }

    if (config.robots) {
        tags.push(
            `<meta name="robots" content="${escapeHtml(config.robots)}" />`,
        );
    }

    // Open Graph tags
    tags.push(
        `<meta property="og:title" content="${escapeHtml(config.ogTitle || config.title)}" />`,
    );
    tags.push(
        `<meta property="og:description" content="${escapeHtml(config.ogDescription || config.description)}" />`,
    );
    tags.push(
        `<meta property="og:type" content="${config.ogType || "website"}" />`,
    );

    if (config.ogImage) {
        tags.push(
            `<meta property="og:image" content="${escapeHtml(config.ogImage)}" />`,
        );
    }

    if (config.canonical) {
        tags.push(
            `<meta property="og:url" content="${escapeHtml(config.canonical)}" />`,
        );
        tags.push(
            `<link rel="canonical" href="${escapeHtml(config.canonical)}" />`,
        );
    }

    // Twitter tags
    if (config.twitterCard) {
        tags.push(
            `<meta name="twitter:card" content="${config.twitterCard}" />`,
        );
    }

    if (config.twitterTitle) {
        tags.push(
            `<meta name="twitter:title" content="${escapeHtml(config.twitterTitle)}" />`,
        );
    }

    if (config.twitterDescription) {
        tags.push(
            `<meta name="twitter:description" content="${escapeHtml(config.twitterDescription)}" />`,
        );
    }

    if (config.twitterImage) {
        tags.push(
            `<meta name="twitter:image" content="${escapeHtml(config.twitterImage)}" />`,
        );
    }

    return tags.join("\n    ");
}

function escapeHtml(text: string): string {
    const map: Record<string, string> = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
    };
    return text.replace(/[&<>"']/g, (char) => map[char] ?? char);
}
