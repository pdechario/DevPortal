# Example Platform

A reference `System` entity. It groups the components that are delivered and
operated together, and it is the thing you point at when you want to answer
"what makes up this platform?"

## What is in it

| Component | Type | Descriptor |
| --- | --- | --- |
| `example-service` | service | `Services/example-service/catalog-info.yaml` |
| `example-lib` | library | `Libraries/example-lib/catalog-info.yaml` |

Membership is declared by the components, not here: each one sets
`spec.system: example-platform`. Backstage resolves that into the relationships
shown on the platform's page, so adding a component never requires editing this
folder.

## Why there is no src/

A `System` is a grouping, not code. There is nothing to compile. If this
platform later grows real infrastructure definitions — Terraform, Helm, Crossplane —
add a `src/` or `infra/` directory then.

## Ownership

Owned by `group:default/platform-team`, a placeholder. Until a matching `Group`
entity is registered, Backstage will flag the owner as unresolved. That warning
is expected and does not block ingestion.
