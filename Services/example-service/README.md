# example-service

A minimal Backstage **Component** of type `service`, used as the template for
declaring a new service. It is a NestJS app exposing a single `/health` route.

```
example-service/
├── catalog-info.yaml   # Component, type: service
├── mkdocs.yml          # TechDocs config
├── docs/index.md       # rendered in the portal's Docs tab
├── package.json
├── tsconfig.json       # decorator metadata enabled (required by NestJS)
├── nest-cli.json
└── src/
    ├── main.ts             # bootstrap
    ├── app.module.ts       # root module
    └── app.controller.ts   # GET /health
```

## Run

```bash
npm install
npm run start
curl localhost:3000/health   # {"status":"ok","service":"example-service"}
```

Honours `PORT`, defaulting to `3000`. Use `npm run start:dev` for watch mode and
`npm run build` to emit `dist/`.

## Copying this for a real service

1. Copy the folder and rename it.
2. Update `metadata.name`, `title`, and `description` in `catalog-info.yaml`,
   set `spec.system` to the owning platform, and fix up `dependsOn`.
3. Update `name` in `package.json` and `site_name` in `mkdocs.yml`.
4. Add the new descriptor to `spec.targets` in the repo-root `catalog-info.yaml`.
5. Raise `spec.lifecycle` from `experimental` to `production` when it ships.
