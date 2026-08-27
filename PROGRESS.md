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
