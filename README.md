# DevPortal

Source of truth for the entities published to our Backstage IDP. Each top-level
directory holds one class of entity, and each entity folder is self-describing:
it carries its own catalog descriptor and its own documentation.

Currently one minimal example of each kind, meant to be copied. A local
Backstage instance lives in `Portal/backstage` and ingests them all — see
`Portal/README.md` to run it.

## Layout

| Directory | Contents |
| --- | --- |
| `Platforms/` | `Domain` and `System` entities — groupings, not code |
| `Services/` | `Component` entities of type `service` — deployable apps |
| `Libraries/` | `Component` entities of type `library` — shared code |
| `Portal/` | The Backstage app itself, in `Portal/backstage/` |
| `catalog-info.yaml` | Root `Location` entity listing every descriptor |
| `PROGRESS.md` | Running log of what changed and why, newest entry first |
| `TODO.md` | The live backlog — what is left, as opposed to what happened |

## Entity graph

```
Domain: example-domain
└── System: example-platform
    ├── Component: example-service   (type: service)
    └── Component: example-lib       (type: library)

example-service ──dependsOn──> example-lib

Component: devportal                 (type: website — the portal itself)
```

Components join a platform by setting `spec.system` in their own descriptor;
the platform never lists its members. Everything is owned by
`group:default/platform-team`, a placeholder — Backstage will flag the owner as
unresolved until a matching `Group` entity exists, which is expected.

## Anatomy of an entity folder

```
<entity>/
├── catalog-info.yaml   # the entity descriptor — the only file Backstage requires
├── mkdocs.yml          # TechDocs config
├── docs/index.md       # rendered in the portal's Docs tab
├── README.md           # for people reading the repo
└── src/                # the code (Backstage does not inspect this)
```

Two things are easy to get wrong:

- **`backstage.io/techdocs-ref: dir:.`** must be present in
  `metadata.annotations`, or TechDocs never finds `mkdocs.yml` and the Docs tab
  renders empty.
- **`docs/` must contain at least `index.md`**, or the TechDocs build fails
  outright rather than degrading.

`Platforms/example-platform` has no `src/` — a `System` is a grouping, so there
is nothing to compile.

## Registering in Backstage

The root `catalog-info.yaml` is a `kind: Location` listing every descriptor, so
one registration ingests the whole repo. Two ways in:

- **Locally** — already wired. `Portal/backstage/app-config.yaml` reads the root
  descriptor as a `type: file` location, so `yarn start` picks up the working
  tree with no registration step at all.
- **A remote Backstage** — register the raw URL of the root
  `catalog-info.yaml` via *Create → Register existing component*.

The same file serves both because **`spec.type` is deliberately omitted**. Left
out, the type is inherited from whatever location read the entity, and the
relative `spec.targets` resolve against the file's own location. Pinning
`type: url` would break local ingestion, since the relative paths would be read
as URLs. Do not add it back.

One non-obvious constraint: a Backstage location only emits entity kinds it is
explicitly allowed to. `create-app`'s default `catalog.rules.allow` omits
`Domain`, and a disallowed kind is **rejected outright** rather than merely
failing to resolve — so `example-domain` silently never appears until `Domain`
is added to that list.

## Adding a component

1. Copy the closest existing folder (`example-service` or `example-lib`) and
   rename it.
2. Update `metadata.name`, `title`, and `description` in `catalog-info.yaml`;
   set `spec.system` and `spec.owner`.
3. Update `site_name` in `mkdocs.yml` and `name` in `package.json`.
4. Add the descriptor to `spec.targets` in the root `catalog-info.yaml`.

`metadata.name` is the catalog's primary key and cross-references resolve by
exact string match, so renaming later means updating every `spec.system`,
`spec.domain`, and `dependsOn` that points at it.

## Local development

The example packages install independently — there is no workspace yet. The
repo pins Node 24 via `.nvmrc` (Backstage requires 22 or 24; run `fnm use`).

`example-service` and the Backstage frontend both default to port 3000, so run
one at a time or set `PORT`.

```bash
cd Services/example-service && npm install && npm run build
PORT=3001 node dist/main.js
curl localhost:3001/health        # {"status":"ok","service":"example-service"}

cd Libraries/example-lib && npm install && npm run build
```

To preview docs the way the portal renders them, use the portal — start it and
open an entity's Docs tab. TechDocs generates via Docker, so **Docker must be
running**, but no local Python or MkDocs install is needed.

For a faster loop on prose alone, `pip install mkdocs-techdocs-core` and run
`mkdocs serve` from inside an entity folder.
