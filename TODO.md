# TODO

The live backlog. This is what a future session reads to decide what to do next.

## Instructions for Claude

This file and `PROGRESS.md` are not the same thing, and conflating them is how
they drift:

- **`PROGRESS.md` is append-only history.** Its "Unfinished / future work"
  sections describe what was open *on that date* and are never edited afterward.
- **`TODO.md` is mutable and deduplicated.** It is the current state of what is
  left, and it is the only file that should be updated when a task's status
  changes.

Rules:

- **Check items off (`- [x]`) rather than deleting them**, so completed work stays
  visible. Prune only when the list gets genuinely unwieldy.
- **Every item names its first concrete step or its blocker.** An item nobody can
  start is not a TODO — it is a wish, and belongs in prose somewhere else.
- **Add items as they are discovered mid-task** instead of dropping them, even
  when they are outside the current scope.
- **When you complete an item, also record it in `PROGRESS.md`** in the same
  session, and cite the date of the entry that first raised it so the *why*
  stays reachable.

---

## Catalog modelling

- [ ] **`Group` and `User` entities for `platform-team`.** Every entity in the
      repo sets `spec.owner: group:default/platform-team`, and nothing declares
      it — confirmed unresolved against a live instance on 2026-08-27. Ingestion
      is unaffected; the owner just renders as a dead link. First step: add an
      `Organization/` folder with a `Group` descriptor, add it to `spec.targets`
      in the root `catalog-info.yaml`, and add `Group`/`User` to
      `catalog.rules.allow` in `Portal/backstage/app-config.yaml`.
      *(Raised 2026-08-26.)*
- [ ] **`kind: API` for `example-service`.** `GET /health` is not modelled, so the
      service's API tab is empty. Needs an OpenAPI spec inline or in a sibling
      file, plus `spec.providesApis` on the component. `API` is already in
      `rules.allow`. *(Raised 2026-08-26.)*
- [ ] **Raise `spec.lifecycle` from `experimental`.** It is `experimental` on
      every entity. Blocked on nothing but a decision about what counts as
      production here. *(Raised 2026-08-26.)*

## Portal

- [ ] **Auth beyond the guest provider.** `auth.providers` has only `guest`, so
      there is no notion of a real user and ownership filters are meaningless.
      GitHub OAuth is the obvious next step; needs an OAuth app and secrets.
- [ ] **Persist the catalog.** The backend uses `better-sqlite3` with
      `connection: ':memory:'`, so the entire catalog is re-ingested on every
      restart and nothing survives. Switch to Postgres in
      `Portal/backstage/app-config.yaml` when that becomes annoying.
- [ ] **Remove the `create-app` example fixtures.** `Portal/backstage/examples/`
      contributes `example-website`, `example-grpc-api`, the `examples` system,
      `example-nodejs-template`, and the `guest` user/`guests` group — 11 of the
      16 ingested entities are demo data. Delete the three `examples/` locations
      from `app-config.yaml`, but note the `guest` user is referenced by the
      guest auth provider, so remove `org.yaml` last and re-test sign-in.
- [ ] **Scaffolder template matching this repo's conventions.** The bundled
      `example-nodejs-template` does not emit the entity-folder layout described
      in `README.md`. A real one would generate `catalog-info.yaml`, `mkdocs.yml`,
      `docs/index.md`, and append to the root `spec.targets`.
- [ ] **Decide between local `file:` locations and GitHub discovery.** The portal
      currently reads the working tree, which means it only reflects local
      uncommitted state. `integrations.github` is stubbed with `${GITHUB_TOKEN}`;
      wiring it needs a PAT from the user.
- [ ] **Docker must be running for any Docs tab to work.** `techdocs.generator.runIn`
      is `docker`. Cheap alternative if that friction bites: `runIn: local`, which
      needs `pip install mkdocs-techdocs-core` and Python ≥3.11 — but this machine
      has Python 3.14, which is untested against `techdocs-core`.

## Repo hygiene

- [ ] **No CI, tests, Dockerfiles, or linting** for `example-service` or
      `example-lib`. Note that `Portal/backstage` ships its own `yarn lint`,
      `yarn test`, and a `Dockerfile` for the backend, so this applies only to
      the two example packages. *(Raised 2026-08-26.)*
- [ ] **Lockfile policy is still undecided.** `package-lock.json` is committed for
      both example packages on the assumption that templates should install
      reproducibly. Remove them if that is not the convention wanted.
      *(Raised 2026-08-26.)*
- [ ] **No root `.github/workflows`.** `create-app` 0.9.1's changelog advertises a
      generated CI workflow, but none was emitted into `Portal/backstage`
      (verified 2026-08-27). If CI is wanted, it has to be written by hand at the
      repo root — a workflow nested under `Portal/backstage/.github/` would never
      run, since Actions only reads the repo root.

## Upstream risks

- [ ] **MkDocs 2.0 removes the plugin system entirely**, which would break
      `techdocs-core` with no migration path and take the whole TechDocs approach
      with it. Nothing actionable yet — track it. *(Raised 2026-08-26.)*
- [ ] **Node is pinned to 24 by `.nvmrc`** because Backstage supports exactly two
      adjacent even majors (`engines.node: "22 || 24"`) and the system Homebrew
      node is 25, which `create-app` rejects outright. When Backstage moves to
      26, bump `.nvmrc` and re-run `yarn install`.
