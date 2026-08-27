# Progress Log

A running record of what changed in this repo and why. Each work session gets one entry.

## Instructions for Claude

When you finish a substantive piece of work, add an entry to this file.

- **Insert new entries directly below this section**, so the newest is first.
- Use the template below verbatim. Keep the three headings even if a section is short; write `None.` rather than deleting a heading.
- **Overview**: 1–2 sentences on what the session accomplished. What changed, not how.
- **Key decisions**: one sentence each, and include the *why* — this section exists so a future reader does not re-litigate a settled choice. Record decisions that constrain future work, not routine implementation details. Include decisions the user made and ones you made on their behalf.
- **Unfinished / future work**: anything knowingly left undone — deferred scope, unverified claims, known risks, follow-ups. Be explicit about what is *unverified* versus what is *not started*, and say what would unblock it.
- Use absolute dates (`2026-08-26`), never "today" or "last week".
- Do not edit prior entries except to correct an outright error; append instead. If a later session reverses an earlier decision, say so in the new entry and reference the date of the one it supersedes.

```markdown
## YYYY-MM-DD — Short title

### Overview
...

### Key decisions
- **Decision** — one sentence, including the why.

### Unfinished / future work
- **Item** — what is missing and what would unblock it.
```

---

## 2026-08-27 — Local Backstage portal, and first validation against a real instance

### Overview
Installed Backstage 1.54.0 in `Portal/backstage` via `create-app`, pointed it at
this repo's root `catalog-info.yaml`, and used it to validate the descriptors for
the first time. All four entities ingest, the full relation graph resolves, and
TechDocs renders for all three documented entities. Added `TODO.md` as the live
backlog, separate from this file's history.

### Key decisions
- **Backstage is now installed in `Portal/backstage`, superseding the 2026-08-26
  decision "Backstage itself is not installed in `Portal/`"** — that entry's own
  top open risk was that nothing had ever checked the descriptors against
  Backstage's real schema, and running an instance was the only way to close it.
  The `create-app` monorepo cost (~1.7 GB of `node_modules`) was accepted for that
  reason.
- **App nested in `Portal/backstage/` rather than `Portal/` itself** — `--path`
  templates directly into the target directory with no emptiness check, so using
  `Portal/` would have overwritten `Portal/README.md`; the extra level keeps a
  human-written explainer above the generated monorepo.
- **Node pinned to 24 via a repo-root `.nvmrc`, installed with `fnm`** — Backstage
  supports exactly two adjacent even majors (`engines.node: "22 || 24"`) and
  `create-app` hard-fails on odd ones, so the system Homebrew node@25 cannot build
  it. `.nvmrc` sits at the repo root because the generated app's `.gitignore`
  ignores `.nvmrc`, so one placed inside it would never be committed.
- **`spec.type: url` removed from the root `catalog-info.yaml`** — omitted, the
  type is inherited from whatever location read the entity, so one descriptor now
  serves both local `file:` ingestion and remote URL registration. Keeping
  `type: url` would have made the relative `spec.targets` be read as URLs and
  broken local ingestion.
- **`Domain` added to `catalog.rules.allow`** — `create-app`'s default list omits
  it, and a disallowed kind is rejected outright rather than merely failing to
  resolve, so `example-domain` would have silently never appeared.
- **The portal registers itself** — `Portal/backstage/catalog-info.yaml` had its
  placeholder `owner: john@example.com` replaced and was added to the root
  `spec.targets`, so the thing serving the catalog appears in it.
- **`create-app`'s `examples/` fixtures were kept for now** — they supply the
  `guest` user that the guest auth provider needs and a working scaffolder demo;
  removing them is tracked in `TODO.md` rather than done blind.
- **`tsBuildInfoFile` pinned inside `dist/` for `example-service`** — see below;
  the two settings that conflicted are now unable to desync.
- **`TODO.md` introduced as a separate, mutable backlog** — this file is
  append-only history, so it cannot answer "what is left right now" without a
  reader diffing every entry.

### Unfinished / future work
- **`example-service`'s build was silently emitting nothing — fixed.** `nest-cli.json`
  sets `deleteOutDir: true` while `tsconfig.json` sets `incremental: true`, so
  `nest build` wiped `dist/`, then tsc consulted the surviving
  `tsconfig.tsbuildinfo`, concluded the output was current, and emitted nothing
  while **exiting 0**. Any build after the first therefore produced an empty
  `dist/` with no error. Fixed by setting `tsBuildInfoFile: "dist/.tsbuildinfo"`
  so the buildinfo is deleted along with the output; verified by building twice in
  a row. `example-lib` sets neither option and was unaffected.
- **Everything the 2026-08-26 entry listed as unverified is now verified.**
  Against the live instance: all four entities ingest with no processing errors;
  `Domain → System → Component` and the `example-service → example-lib`
  `dependsOn` edge all resolve, including the auto-derived reverse
  `dependencyOf`; TechDocs builds and serves HTTP 200 for `example-service`,
  `example-lib`, and `example-platform`. Both example packages build and the
  service answers `/health` under Node 24.
- **`group:default/platform-team` is still undeclared** — confirmed unresolved
  against the live instance. Ingestion is unaffected; the owner renders as a dead
  link. Tracked in `TODO.md`.
- **The first `yarn start` on a cold cache crashes the backend.** The `app` plugin
  fails with `IPC request 'DevDataStore.load' with ID 0 timed out` because
  webpack's first compile outruns the backend's wait, and the whole backend then
  shuts down — every `/api/*` returns 404 while the frontend still serves. A
  second `yarn start` succeeds with a warm cache. Not worked around; if it becomes
  a recurring annoyance the two halves can be started separately.
- **Catalog state does not survive restarts** — `better-sqlite3` with
  `connection: ':memory:'`. Re-ingested from disk on every boot.
- **11 of the 16 ingested entities are `create-app` demo data.** Tracked in
  `TODO.md`.
- **`create-app` emitted no `.github/` directory** despite its 0.9.1 changelog
  advertising a generated CI workflow. There is still no CI anywhere in the repo.
- **Guest is the only auth provider**, so ownership filtering is meaningless.

## 2026-08-26 — Initial Backstage catalog scaffold

### Overview
Scaffolded one minimal example of each catalog entity type — a platform, a service, and a library — each self-describing with its own `catalog-info.yaml`, `mkdocs.yml`, and `docs/`. The three folders are intended to be copied as templates when declaring real components.

### Key decisions
- **Platform modeled as `Domain` + `System`, not a `Component`** — components join via `spec.system`, which makes Backstage render a connected graph instead of three unrelated tiles.
- **No `src/` in the platform folder** — a `System` is a grouping, not code, so there is nothing to compile; add `infra/` later if it grows real Terraform or Helm.
- **Repo-root `catalog-info.yaml` is a `kind: Location`** — registering its single URL ingests all four entities, so adding a component means adding one line to `spec.targets` rather than a separate registration.
- **Backstage itself is not installed in `Portal/`** — the entities target an existing IDP, and `create-app` would add a full Yarn monorepo and roughly a gigabyte of dependencies for no benefit here.
- **NestJS/TypeScript for `src/`** — matches the NestJS-flavored `.gitignore` already in the repo; the code exists only so the entities describe something that actually runs.
- **Generic `example-*` naming** — signals these folders are templates to copy, and `metadata.name` is the catalog's primary key, so choosing it deliberately now avoids chasing cross-references later.
- **Service → library dependency declared in the catalog only, not in `package.json`** — a real import needs a `file:` link or a workspace, which is friction that buys nothing while the packages are illustrative.
- **TypeScript pinned to `^5.9.3` rather than the latest 7.0.2** — `@nestjs/cli` 11 bundles 5.9.3 and NestJS 11 is not validated against the TypeScript 7 rewrite.
- **`spec.owner` is a placeholder `group:default/platform-team`** — Backstage will flag the owner as unresolved until a matching `Group` exists, which is expected and does not block ingestion.

### Unfinished / future work
- **Entity schema validation is unverified** — YAML parsing, cross-reference resolution, both builds, and `mkdocs build --strict` all pass locally, but nothing has confirmed the descriptors against Backstage's actual schema; register the root `catalog-info.yaml` in a real instance to close this.
- **No `Group` entity for `platform-team`** — every entity points at an owner that does not exist yet.
- **MkDocs 2.0 is an upstream risk** — `mkdocs-material` warns on every build that MkDocs 2.0 removes the plugin system entirely, which would break `techdocs-core` with no migration path; nothing to do now, but it threatens the whole TechDocs approach and is worth tracking.
- **No API entity for the service** — `GET /health` is not described by a Backstage `kind: API`, so the catalog does not model the service's interface.
- **No CI, tests, Dockerfiles, or linting** for either example package.
- **`spec.lifecycle` is `experimental` everywhere** — raise to `production` when anything real ships.
- **Lockfile policy undecided** — `package-lock.json` was committed for both packages on the assumption that templates should install reproducibly; remove them if that is not the convention you want.
- **`Portal/` holds only a README** — it exists to explain its own emptiness and the `create-app` path if a local portal is ever wanted.
