# Customer project metadata

This directory contains the non-secret contract that is copied into a
customer project repository. The starter itself does not contain a customer
identity, an allocated `project_id`, or a live environment record.

Approved provisioning materializes these files after the Control Plane has
allocated the permanent project:

```text
.unfogy/
├── project.yaml
└── environments/
    ├── staging.yaml
    └── production.yaml
```

The customer project owns the repository and its corresponding Coolify
Project. Multiple MWO records can deliver changes to the same project. An MWO
is a temporary work record; `origin_mwo_ref` is optional creation provenance
and never determines repository ownership or its checkout path.

The Control Plane allocates a stable, opaque, path-safe `project_id`. The
metadata contract permits lowercase letters, digits, and interior hyphens;
the value starts and ends with an alphanumeric character and is at most 63
characters. Allocation also validates the complete domain label when domains
are created. The checkout convention is:


```text
workspaces/customers/<CST...>/projects/<project_id>
```

The path is a local routing convention, not an authority or a public project
identifier. Each `project.yaml` may also carry optional purposes for top-level
folders such as `apps` and `tests`; it does not carry runtime state.

Provisioning plans and their approvals remain scoped to `MWO + environment`.
Repository ownership, provider resource identity, and the shared mutation
lease are scoped to `project_id + environment` so multiple MWO records can
work on the same project safely. Runtime status and audit remain Control Plane
records.

Metadata files may contain recipe versions, domains, and non-secret provider
references. They must not contain approval decisions, live status, lease data,
credentials, or secret values. See `schema/` for the machine-readable
contracts and `templates/` for allocation-free examples.

## Application layout

The starter keeps the Nuxt application at repository root (`app/`, `server/`,
and `nuxt.config.ts`). The current Coolify recipe does not declare an
application base directory, so moving the app to `apps/web` would be a
compatibility change requiring a new recipe/starter contract revision.
