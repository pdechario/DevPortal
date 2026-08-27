# Example Service

A reference `Component` of `spec.type: service` — a deployable NestJS HTTP
application.

## Run locally

```bash
npm install
npm run start          # or start:dev for watch mode
curl localhost:3000/health
```

```json
{ "status": "ok", "service": "example-service" }
```

Listens on `PORT`, defaulting to `3000`.

## Endpoints

| Method | Path | Response |
| --- | --- | --- |
| `GET` | `/health` | `{ "status": "ok", "service": "example-service" }` |

That is the whole surface area. It exists so the entity describes something that
actually runs.

## Layout

| File | Role |
| --- | --- |
| `src/main.ts` | Bootstrap; creates the Nest app and listens |
| `src/app.module.ts` | Root module; registers the controller |
| `src/app.controller.ts` | The `/health` route |

`tsconfig.json` sets `experimentalDecorators` and `emitDecoratorMetadata`.
NestJS relies on decorator metadata for dependency injection and will fail at
runtime without both.

## Catalog

Belongs to `example-platform` via `spec.system`, and declares
`dependsOn: component:default/example-lib`. That edge is catalog-level only —
`package.json` has no dependency on the library yet. Wire one with
`npm install file:../../Libraries/example-lib`, or convert the repo to a
workspace, when the service needs the shared code.
