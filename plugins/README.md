# Bun Gallery Plugin

A powerful, zero-config custom Bun plugin that automatically generates dynamic gallery sections from image directories. No more manually editing HTML when adding new photos!

## ✨ Features

- 🎨 **Automatic Gallery Generation** - Scans image directories and dynamically generates gallery sections
- 📁 **Zero-Config** - Just add images to folders and rebuild
- 🖼️ **Multiple Format Support** - JPG, JPEG, PNG, WebP, and GIF
- 📱 **Mobile Responsive** - Built with Tailwind CSS and DaisyUI
- ⌨️ **Full Navigation** - Keyboard, swipe, and click navigation
- 🔗 **Auto-Generated Navigation** - Desktop, tablet, and mobile navs all auto-generated
- ⚡ **Build-Time Optimization** - All processing happens during build, zero runtime overhead
- 🎯 **Configurable Sections** - Easy to add/remove/customize gallery categories

## How It Works

### 1. Configuration (gallery-plugin.ts)

Define your gallery sections:

```typescript
const GALLERY_SECTIONS: GallerySection[] = [
    {
        id: "real-estate",                    // HTML anchor ID
        title: "Real Estate",                 // Display name
        description: "Professional aerial...", // Section description
        directory: "fatdanny2",               // Image folder
    },
    // Add more sections...
];
```

### 2. HTML Markers (gallery.html)

The plugin replaces special HTML comments with generated content:

```html
<!-- GALLERY_SECTIONS_START -->
<!-- Auto-generated gallery sections -->
<!-- GALLERY_SECTIONS_END -->

<!-- GALLERY_NAV_START -->
<!-- Auto-generated desktop nav -->
<!-- GALLERY_NAV_END -->

<!-- GALLERY_MOBILE_NAV_START -->
<!-- Auto-generated mobile nav -->
<!-- GALLERY_MOBILE_NAV_END -->
```

### 3. Build Process

When you run `bun run build`:

1. Plugin scans configured directories
2. Finds all supported image files
3. Generates HTML gallery cards
4. Replaces markers with generated content
5. Output is minified and optimized

## Quick Start

### Adding Images to Existing Gallery

1. Add image files to one of the existing directories:
   - `fatdanny2/` - Real Estate
   - `fatdanny/` - General & Night Time
   - `poop/` - Additional photos

2. Rebuild:
   ```bash
   bun run build
   ```

3. Done! Images appear automatically

### Adding a New Gallery Section

1. **Create a directory:**
   ```bash
   mkdir website/my-gallery
   # Add images to this directory
   ```

2. **Update the plugin** (`plugins/gallery-plugin.ts`):
   ```typescript
   const GALLERY_SECTIONS: GallerySection[] = [
       // ... existing sections ...
       {
           id: "my-gallery",
           title: "My Gallery",
           description: "Description of this gallery",
           directory: "my-gallery",
       },
   ];
   ```

3. **Update navigation markers in gallery.html:**

   **Desktop Nav:**
   ```html
   <!-- GALLERY_NAV_START -->
   <li>
       <a href="#my-gallery" class="link link-hover text-sm">My Gallery</a>
   </li>
   <!-- GALLERY_NAV_END -->
   ```

   **Mobile Nav:**
   ```html
   <!-- GALLERY_MOBILE_NAV_START -->
   <a href="#my-gallery" class="btn btn-sm btn-ghost">My Gallery</a>
   <!-- GALLERY_MOBILE_NAV_END -->
   ```

4. **Rebuild:**
   ```bash
   bun run build
   ```

## Configuration Details

### Section Properties

| Property | Type | Required | Example |
|----------|------|----------|---------|
| `id` | string | Yes | `"weddings"` |
| `title` | string | Yes | `"Wedding Photography"` |
| `description` | string | Yes | `"Aerial wedding photos"` |
| `directory` | string | Yes | `"wedding-photos"` |

- **id**: Used in HTML anchors (`#real-estate`), must be unique
- **title**: What users see in navigation and section headings
- **description**: Displayed above each gallery section
- **directory**: Path relative to project root where images are stored

## Supported Image Formats

The plugin automatically detects and includes:

- `.jpg` / `.jpeg`
- `.png`
- `.webp` (recommended for web)
- `.gif`

**File naming tip:** Use consistent, descriptive names:
- Good: `DJI_20250628_aerial_property.jpg`
- Avoid: `photo 1 (1).jpg`

## Real-World Examples

### Example: Wedding Photography

```typescript
{
    id: "weddings",
    title: "Wedding Photography",
    description: "Beautiful aerial photography for special occasions",
    directory: "weddings",
}
```

Directory structure:
```
website/
├── weddings/
│   ├── ceremony.jpg
│   ├── reception.jpg
│   └── details.jpg
├── plugins/gallery-plugin.ts
└── gallery.html
```

### Example: Real Estate Portfolio

```typescript
{
    id: "commercial",
    title: "Commercial Properties",
    description: "Large-scale commercial development projects",
    directory: "commercial-properties",
},
{
    id: "residential",
    title: "Residential Homes",
    description: "Beautiful residential properties",
    directory: "residential",
},
```

### Example: Event Coverage

```typescript
{
    id: "corporate-events",
    title: "Corporate Events",
    description: "Aerial coverage of corporate gatherings",
    directory: "corporate",
},
{
    id: "sports",
    title: "Sports & Action",
    description: "Dynamic aerial sports photography",
    directory: "sports",
},
```

## Generated Features

The plugin automatically creates galleries with:

- **Image Cards** - Hover animations, lazy loading, aspect ratio preservation
- **Modal Viewer** - Click any image to open full-screen modal
- **Navigation** - Previous/Next buttons in modal
- **Keyboard Support** - Arrow keys (← →) to navigate, Esc to close
- **Touch Support** - Swipe left/right to navigate
- **Responsive Design** - Adapts to mobile, tablet, and desktop
- **Active States** - Nav links highlight current section
- **Accessibility** - Proper alt text, semantic HTML

## Customization

### Changing Card Appearance

Edit `generateGalleryCard()` in `gallery-plugin.ts`:

```typescript
function generateGalleryCard(image: GalleryImage): string {
    return `
        <div class="card bg-base-100 shadow-xl ...">
            <!-- Customize this HTML -->
        </div>
    `;
}
```

Available Tailwind/DaisyUI classes:
- Colors: `bg-base-100`, `bg-primary`, `bg-secondary`
- Shadows: `shadow-lg`, `shadow-xl`, `shadow-2xl`
- Spacing: `p-4`, `gap-6`, `mb-12`
- Hover effects: `hover:shadow-2xl`, `hover:scale-105`

### Changing Section Layout

Edit `generateGallerySection()` in `gallery-plugin.ts`:

```typescript
function generateGallerySection(
    section: GallerySection,
    images: GalleryImage[]
): string {
    // Modify the section HTML
    return `<section>...</section>`;
}
```

### Custom Alt Text

Alt text is auto-generated from filenames. To customize:

1. Edit `getImagesFromDirectory()`:
```typescript
alt: file.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " "),
                                    ↑ Change this logic
```

2. Or manually update descriptions after generation

## Troubleshooting

### Images not appearing

**Check:**
- Directory path is correct and relative to project root
- Image files have supported extensions (.jpg, .png, etc.)
- Folder exists and contains images
- Built the project: `bun run build`

**Debug:**
- Look for error messages in build output
- Verify file paths in browser DevTools Network tab

### Gallery section missing

**Check:**
- HTML markers present in gallery.html
- Section id is unique (no duplicates)
- Directory has at least one image
- Nav links use correct `href="#section-id"` format

**Fix:**
- Add `<!-- GALLERY_SECTIONS_START -->` and `<!-- GALLERY_SECTIONS_END -->` markers
- Rebuild: `bun run build`

### Build fails

**Check:**
- No syntax errors in plugin configuration
- Directory names don't contain special characters
- All image files have valid extensions
- Paths don't have trailing slashes

**Solution:**
- Check console output for specific error
- Verify TypeScript syntax
- Test with a simple directory first

### Images in wrong order

**Fix:**
- Images are sorted alphabetically by filename
- Rename files with numbers: `01.jpg`, `02.jpg`, etc.
- Or reorganize GALLERY_SECTIONS array order

## Performance

- **Build Time:** Minimal overhead (milliseconds per directory scan)
- **Runtime:** Zero runtime cost—all generation happens at build time
- **File Size:** Generated HTML is minified for production
- **Images:** Lazy-loaded on demand (performant on mobile)

## File Size Considerations

**Tips for optimized galleries:**

1. **Use WebP format** - Smaller files, modern browsers
   ```bash
   cwebp input.jpg -o output.webp
   ```

2. **Compress images** - Reduce file size before adding
   ```bash
   imagemagick, tinypng, or similar tools
   ```

3. **Resize for web** - Don't use 4K images for gallery thumbnails
   ```bash
   ImageMagick: convert input.jpg -resize 1920x1080 output.jpg
   ```

## Security Notes

- Plugin only runs during build time
- No runtime file access or vulnerabilities
- Generated output is static HTML/CSS/JS
- Safe to host on any static hosting service

## Integration with Build Pipeline

The plugin is integrated in `build.ts`:

```typescript
import galleryPlugin from "./plugins/gallery-plugin";

await Bun.build({
    plugins: [galleryPlugin, plugin], // gallery plugin runs first!
    // ... rest of config
});
```

**Important:** Gallery plugin must run before the Tailwind plugin to ensure styles are properly applied.

## Development vs. Production

- **Development:** Use `bun --hot ./gallery.html` for rapid iteration
  - Files reload when you change gallery.html
  - For new images: stop server and rebuild

- **Production:** Use `bun run build`
  - Minified output
  - Optimized for best performance

## Common Workflows

### Workflow 1: Weekly Photo Updates

1. Photographer provides images
2. Add to appropriate folder
3. Run `bun run build`
4. Deploy

### Workflow 2: Client Website

1. Create sections for different property types
2. Client uploads photos to shared folder
3. You copy to appropriate directory
4. Rebuild and deploy

### Workflow 3: Multi-Photographer

1. Create section per photographer
2. Each has their own directory
3. Photos auto-organize into their section
4. Easy to add/remove work

## Future Enhancement Ideas

- Image filtering/search in UI
- Lightbox animations
- Category tags and filters
- EXIF data extraction
- Thumbnail generation
- Image optimization pipeline
- CMS integration hooks

## Support & Debugging

**Enable verbose logging:**
```typescript
// In gallery-plugin.ts, the plugin logs:
console.log(`✓ Gallery plugin: Generated X categories with Y images`);
```

**Check output:**
- Look in `docs/gallery.html` after build
- Verify markers were replaced with gallery HTML
- Check browser DevTools for any errors

**Reset and rebuild:**
```bash
rm -rf docs
bun run build
```

## License & Attribution

This plugin is custom-built for your project. Feel free to modify and extend it as needed!

---

**Happy building! 🚀**