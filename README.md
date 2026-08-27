# DevPortal

Source of truth for the entities published to our Backstage IDP. Each top-level
directory holds one class of entity, and each entity folder is self-describing:
it carries its own catalog descriptor and its own documentation.

Currently one minimal example of each kind, meant to be copied.

## Layout

| Directory | Contents |
| --- | --- |
| `Platforms/` | `Domain` and `System` entities — groupings, not code |
| `Services/` | `Component` entities of type `service` — deployable apps |
| `Libraries/` | `Component` entities of type `library` — shared code |
| `Portal/` | Placeholder. The Backstage app is not installed here. |
| `catalog-info.yaml` | Root `Location` entity listing every descriptor |
| `PROGRESS.md` | Running log of what changed and why, newest entry first |

## Entity graph

```
Domain: example-domain
└── System: example-platform
    ├── Component: example-service   (type: service)
    └── Component: example-lib       (type: library)

example-service ──dependsOn──> example-lib
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

Register the raw URL of the **root** `catalog-info.yaml` via *Create → Register
existing component*. It is a `Location` entity, so all four entities are
ingested in one pass. Add new descriptors to its `spec.targets`.

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

The example packages install independently — there is no workspace yet.

```bash
cd Services/example-service && npm install && npm run start
curl localhost:3000/health        # {"status":"ok","service":"example-service"}

cd Libraries/example-lib && npm install && npm run build
```

To preview docs the way the portal renders them:

```bash
pip install mkdocs-techdocs-core
mkdocs serve                      # from inside an entity folder
```
