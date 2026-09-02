# Organization

User and group entities for the DevPortal, demonstrating generic naming and namespace organization.

## Namespaces

- **namespace1** — Contains team1 and its users
- **namespace2** — Contains team2 and its users

## Groups

- **team1** (namespace1) — Generic team 1
- **team2** (namespace2) — Generic team 2

## Users

Users are declared in `users.yaml` and organized by namespace. User group memberships (`spec.memberOf`)
can reference groups in the same namespace (short name) or cross-namespace (fully qualified ref).

### Adding a new group

Add a new `Group` entity to `groups.yaml`:

```yaml
apiVersion: backstage.io/v1alpha1
kind: Group
metadata:
  name: team3
  title: Team 3
  namespace: namespace1
spec:
  type: team
  profile:
    displayName: Team 3
    email: team3@example.com
  children: []
```

Then add members to `users.yaml` by setting their `spec.memberOf`. For same-namespace groups, use the short name:

```yaml
spec:
  memberOf:
    - team3
```

For cross-namespace group references, use the fully-qualified form:

```yaml
spec:
  memberOf:
    - group:namespace2/team2
```

### Adding a new user

Add a `User` entity to `users.yaml`:

```yaml
apiVersion: backstage.io/v1alpha1
kind: User
metadata:
  name: user5
  title: User 5
  namespace: namespace1
spec:
  profile:
    displayName: User 5
    email: user5@example.com
  memberOf:
    - team1
    - group:namespace2/team2
```
