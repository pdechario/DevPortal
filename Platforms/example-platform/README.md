# example-platform

A minimal Backstage **System** (plus its parent **Domain**), used as the template
for declaring a new platform.

```
example-platform/
├── catalog-info.yaml   # Domain: example-domain + System: example-platform
├── mkdocs.yml          # TechDocs config
├── docs/index.md       # rendered in the portal's Docs tab
└── README.md
```

No `src/` — a System is a grouping, not code.

## Copying this for a real platform

1. Copy the folder and rename it.
2. In `catalog-info.yaml`, change the `System`'s `metadata.name`, `title`, and
   `description`. Reuse the existing `example-domain` or declare a new `Domain`.
3. Set `spec.owner` to a real `Group`.
4. Update `site_name` in `mkdocs.yml` to match the new name.
5. Add the new descriptor to `spec.targets` in the repo-root `catalog-info.yaml`.

Components join a platform by setting `spec.system: <name>` in their own
descriptor — you do not list them here.
