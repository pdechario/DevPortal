# Organization

User and group entities for the DevPortal.

## Groups

- **platform-team** — Core platform engineering team that owns platform components and infrastructure.

## Users

Members of the platform team and other stakeholders. Users are declared in `users.yaml` and list their group memberships via `spec.memberOf`.

### Adding a new group

Add a new `Group` entity to `groups.yaml`:

```yaml
apiVersion: backstage.io/v1alpha1
kind: Group
metadata:
  name: new-team
  title: New Team
spec:
  type: team
  profile:
    displayName: New Team
    email: newteam@example.com
```

Then add members to `users.yaml` by setting their `spec.memberOf`:

```yaml
spec:
  memberOf:
    - platform-team
    - new-team
```

### Adding a new user

Add a `User` entity to `users.yaml`:

```yaml
apiVersion: backstage.io/v1alpha1
kind: User
metadata:
  name: alice
spec:
  profile:
    displayName: Alice
    email: alice@example.com
  memberOf:
    - platform-team
```
