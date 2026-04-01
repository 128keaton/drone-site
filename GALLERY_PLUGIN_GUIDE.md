# Gallery Plugin Setup & Usage Guide

## Overview

Your website now has a custom Bun gallery plugin that automatically generates dynamic gallery sections from image directories. This means you can add new photos without editing HTML!

## ✨ What the Plugin Does

- **Scans image directories** during the build process
- **Automatically generates** gallery sections with all photos
- **Creates navigation links** for desktop and mobile
- **Provides interactive features**: click to view, keyboard navigation, swipe support
- **Zero runtime overhead** - everything is pre-generated at build time

## 🚀 Quick Start

### For Development (Live Editing)

```bash
bun --hot ./index.html ./gallery.html
```

This starts a dev server at `http://localhost:3000/` with hot reload. The dev server serves your static files as-is without running plugins.

**Note:** When you add new images, you'll need to:
1. Stop the dev server (Ctrl+C)
2. Run `bun run build`
3. Restart the dev server

### For Production (Building for Deployment)

```bash
bun run build
```

This creates optimized, min