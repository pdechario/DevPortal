# example-lib

A minimal Backstage **Component** of type `library`, used as the template for
declaring a new shared library.

```
example-lib/
├── catalog-info.yaml   # Component, type: library
├── mkdocs.yml          # TechDocs config
├── docs/index.md       # rendered in the portal's Docs tab
├── package.json        # main: dist/index.js, types: dist/index.d.ts
├── tsconfig.json       # declaration: true
└── src/index.ts        # export function greet()
```

## Build

```bash
npm install
npm run build     # -> dist/index.js, dist/index.d.ts
```

No runtime dependencies; TypeScript is the only dev dependency.

## Copying this for a real library

1. Copy the folder and rename it.
2. Update `metadata.name`, `title`, and `description` in `catalog-info.yaml`,
   and set `spec.system` to the owning platform.
3. Update `name` in `package.json` and `site_name` in `mkdocs.yml`.
4. Add the new descriptor to `spec.targets` in the repo-root `catalog-info.yaml`.
