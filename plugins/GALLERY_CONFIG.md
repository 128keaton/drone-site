# Gallery Plugin Quick Start Guide

## Overview

The Bun Gallery Plugin automatically generates your image gallery from directories, eliminating manual HTML editing.

## Quick Setup

### 1. Add Your Images

Create folders in your project root and add images:

```
website/
├── fatdanny2/          # Real Estate photos
│   ├── image1.jpg
│   ├── image2.jpg
│   └── ...
├── fatdanny/           # General & Night Time photos
│   ├── photo1.jpg
│   ├── photo2.jpg
│   └── ...
└── gallery-plugin.ts   # Plugin configuration
```

### 2. Configure Categories (Optional)

Edit `plugins/gallery-plugin.ts` to customize gallery sections:

```typescript
const GALLERY_SECTIONS: GallerySection[] = [
  {
    id: "real-estate",           // Unique identifier for HTML anchor
    title: "Real Estate",        // Display title in navigation
    description: "Professional aerial photography...",  // Section subtitle
    directory: "fatdanny2",      // Folder to scan for images
  },
  {
    id: "general",
    title: "General",
    description: "Beautiful aerial landscapes...",
    directory: "fatdanny",
  },
  // Add more sections here
];
```

### 3. Build

```bash
bun run build
```

The plugin will:
- Scan each configured directory for images
- Generate gallery sections from the images
- Update navigation automatically
- Output to the `docs/` folder

## Supported Image Formats

- `.jpg` / `.jpeg`
- `.png`
- `.webp`
- `.gif`

## Common Tasks

### Add Images to Existing Category

1. Copy image files to the category's folder (e.g., `fatdanny2/`)
2. Run `bun run build`
3. Done! New images appear automatically

### Create a New Category

1. Create a new folder: `mkdir website/my-category`
2. Add images to the folder
3. Add section to `GALLERY_SECTIONS` in `plugins/gallery-plugin.ts`:
   ```typescript
   {
     id: "my-category",
     title: "My Category",
     description: "Description here",
     directory: "my-category",
   }
   ```
4. Run `bun run build`

### Remove a Category

1. Remove the section from `GALLERY_SECTIONS` in `plugins/gallery-plugin.ts`
2. Run `bun run build`
3. (Optional) Delete the image folder

### Update Category Title or Description

1. Edit the section in `GALLERY_SECTIONS`:
   ```typescript
   {
     id: "real-estate",
     title: "New Title",              // Change this
     description: "New description",  // Or this
     directory: "fatdanny2",
   }
   ```
2. Run `bun run build`

## How Navigation Works

The plugin automatically generates:

- **Desktop Navigation**: Sticky sidebar with links to all categories
- **Mobile Navigation**: Bottom nav bar for mobile devices
- **Active Highlighting**: Current section is highlighted as you scroll
- **Smooth Scrolling**: Links smoothly scroll to sections

## Image Organization Tips

### By Date
```
fatdanny2/
├── 2025-01-15_property_01.jpg
├── 2025-01-15_property_02.jpg
└── 2025-01-20_property_01.jpg
```

### By Project
```
fatdanny2/
├── downtown-complex_01.jpg
├── downtown-complex_02.jpg
├── riverside-estate_01.jpg
└── riverside-estate_02.jpg
```

### By Type
```
fatdanny2/
├── exteriors/
│   ├── image1.jpg
│   └── image2.jpg
└── aerials/
    ├── image3.jpg
    └── image4.jpg
```

**Note**: Subfolders won't be scanned. Keep images in the root of each category folder.

## File Naming Conventions

Recommended naming for clarity:

- Use descriptive names: `DJI_property_downtown_aerial_01.jpg`
- Prefix with category: `real-estate_01.jpg`
- Include date: `2025-01-15_DJI_01.jpg`
- Use underscores or hyphens (spaces will be converted in alt text)

## Development Workflow

### For Quick Testing

```bash
bun --hot ./gallery.html
```

This auto-reloads on file changes (useful for CSS/JS development).

### For Production Build

```bash
bun run build
```

This generates the final optimized version in `docs/`.

## Gallery Features

Once built, your gallery includes:

- ✅ Click images to view in a modal
- ✅ Arrow buttons to navigate between images
- ✅ Keyboard navigation (arrow keys, Escape to close)
- ✅ Touch/swipe support on mobile
- ✅ Lazy loading (images load as needed)
- ✅ Hover effects on gallery cards
- ✅ Responsive design (mobile, tablet, desktop)

## Customization

### Change Gallery Card Style

Edit `generateGalleryCard()` in `plugins/gallery-plugin.ts` to modify:
- Card colors
- Hover effects
- Image aspect ratio
- Shadow effects

### Change Section Layout

Edit `generateGallerySection()` to modify:
- Section background colors
- Grid layout (currently 3 columns on desktop)
- Title styling
- Description formatting

## Troubleshooting

### Images Not Showing

**Problem**: Added