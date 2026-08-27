# Example Library

A reference `Component` of `spec.type: library` — code consumed by other
components rather than deployed on its own.

## Install

Not published to a registry. While this repo is a set of independent packages,
consume it with a file dependency:

```bash
npm install file:../../Libraries/example-lib
```

If the repo later becomes an npm/Yarn workspace, replace that with a normal
version range.

## Usage

```ts
import { greet } from '@example/example-lib';

greet('world'); // -> "Hello, world!"
```

## Build

```bash
npm install
npm run build
```

Emits `dist/index.js` plus `dist/index.d.ts`. `declaration: true` is what makes
the types usable by consumers; without it, importers fall back to `any`.

## Catalog

Belongs to the `example-platform` system via `spec.system`. Note that
`example-service` declares `dependsOn: component:default/example-lib`, so the
catalog graph shows the edge even though no npm dependency exists yet.
