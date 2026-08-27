# Portal

The Backstage instance that serves this repository's catalog. Generated with
`@backstage/create-app` and pinned to Backstage **1.54.0** (see
`backstage/backstage.json`).

Unlike the other top-level directories, this one is not a catalog entity folder
you copy — it is a single Yarn 4 monorepo. It does register itself in the
catalog, as a `Component` of type `website`, via `backstage/catalog-info.yaml`.

## Layout

```
Portal/backstage/
├── app-config.yaml         # the only file this repo meaningfully customises
├── catalog-info.yaml       # the portal as a catalog entity
├── packages/app/           # frontend
├── packages/backend/       # backend
├── examples/               # create-app's demo entities, org, and template
└── plugins/                # empty; local plugins go here
```

## Running it

Backstage requires **Node 22 or 24** — `create-app` hard-fails on odd-numbered
majors, so the system `node@25` will not work. The repo root carries a `.nvmrc`
pinning 24.

```bash
fnm use                       # or: fnm exec --using=24 -- <command>
cd Portal/backstage
yarn install                  # ~1.7 GB of node_modules, several minutes
yarn start
```

Frontend on **:3000**, backend on **:7007**. Sign in as **Guest** — that is the
only auth provider configured.

Note that `Services/example-service` also listens on 3000 and will collide with
the frontend; run one at a time, or move the service.

## How the catalog gets in

`app-config.yaml` reads the repo-root descriptor as a single `file:` location:

```yaml
- type: file
  target: ../../../../catalog-info.yaml
```

Two things about that path are easy to get wrong:

- **File targets resolve relative to the backend process directory**
  (`packages/backend`), not to `app-config.yaml`. Hence four levels up.
- The root descriptor is a `kind: Location`, so this one target pulls in every
  entity listed in its `spec.targets`. Adding a component still means adding one
  line there — not here.

`catalog.rules.allow` also had to be widened. The `create-app` default is
`[Component, System, API, Resource, Location]`; **`Domain` is absent**, and a
disallowed kind is rejected outright rather than merely failing to resolve, so
`example-domain` would silently never appear.

The backend uses `better-sqlite3` with an **in-memory** database, so the whole
catalog is re-ingested from disk on every restart. Edits to any
`catalog-info.yaml` show up after a restart with no migration or cleanup.

## Docs

TechDocs runs at its generated defaults: `builder: local`,
`generator.runIn: docker`, `publisher: local`. That means **Docker must be
running** to view an entity's Docs tab, and the first build of each entity is
slow because it pulls the `spotify/techdocs` image. No local Python or MkDocs
install is needed.
