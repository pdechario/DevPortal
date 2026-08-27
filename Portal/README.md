# Portal

Intentionally empty. The Backstage application is **not** installed in this
repository — the entities here are meant to be registered into an existing
Backstage IDP.

## If you do want a local portal

```bash
npx @backstage/create-app@latest    # run from this directory
```

That generates a full Yarn monorepo (frontend + backend packages) and pulls
roughly a gigabyte of dependencies, so it is a real project rather than
scaffolding. Afterwards, point the new app at this repo's entities by adding the
root descriptor to `app-config.yaml`:

```yaml
catalog:
  locations:
    - type: file
      target: ../../catalog-info.yaml
      rules:
        - allow: [Location, Domain, System, Component]
```

`rules.allow` matters: Backstage rejects entity kinds that a location is not
explicitly permitted to emit.

To render the TechDocs pages locally you also need the MkDocs toolchain:

```bash
pip install mkdocs-techdocs-core
```
