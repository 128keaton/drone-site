# website

To install dependencies:

```bash
bun install
```

To develop locally:

```bash
bun run dev
```

To build the static site:

```bash
bun run build
```

The production output is written to `docs/` for GitHub Pages.

GitHub Pages deployment is handled by the workflow in `.github/workflows/static.yml` and publishes the `docs/` directory on pushes to `main`.
