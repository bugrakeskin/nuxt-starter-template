# Customer MWO application metadata

This directory contains the non-secret contract that is copied into a
customer MWO repository. The starter itself does not contain a customer
identity, an allocated MWO, or a live environment record.

Approved provisioning materializes these files after the Control Plane has
allocated the permanent project:

```text
.unfogy/
├── project.yaml
└── environments/
    ├── preview.yaml
    └── production.yaml
```

The MWO owns this repository and its corresponding Coolify Project. All Tasks
for the same MWO use this repository and environment set. A different
application requires a different MWO and repository. The Control Plane owns
the declarative provisioning and deployment record at:


```text
customers/<CST...>/<MWO...>/.unfogy/
```

The application checkout is a separate local repository at:

```text
workspaces/customers/<CST...>/<MWO...>/
```

Both paths are routing conventions, not authority. Control Plane allocation,
approval, revision, lease, task state and runtime status remain outside this
repository. The materialized `.unfogy/` files contain only non-secret
application contract and environment metadata; they do not contain
provisioning intent, deployment authority, or live state.

Provisioning plans and their approvals remain scoped to `MWO + environment`.
Repository ownership and provider resource identity are scoped to the MWO and
environment. Runtime status and audit remain Control Plane records.

Metadata files may contain recipe versions, domains, and non-secret provider
references. They must not contain approval decisions, live status, lease data,
credentials, or secret values. See `schema/` for the machine-readable
contracts and `templates/` for allocation-free examples.

## Application layout

The starter keeps the Nuxt application at repository root (`app/`, `server/`,
and `nuxt.config.ts`). The current Coolify recipe does not declare an
application base directory, so moving the app to `apps/web` would be a
compatibility change requiring a new recipe/starter contract revision.
