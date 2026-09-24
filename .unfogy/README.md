# Customer MWO application contract

This directory contains the non-secret application contract and the single
allocation-free MWO configuration template copied into a customer MWO
repository. The starter itself does not contain a customer identity, an
allocated MWO, or a live environment record.

Approved provisioning materializes these files after the Control Plane has
allocated the permanent project:

```text
.unfogy/
├── config.yaml
├── schema/config.schema.json
└── starter.yaml
```

The MWO owns this repository and its corresponding Coolify Project. All Tasks
for the same MWO use this repository and environment set. A different
application requires a different MWO and repository. The Control Plane tracks
the customer container and the MWO repository is an independent Git checkout:


```text
workspaces/customers/<CST...>/customer.yaml
```

The application checkout is a separate local repository at:

```text
workspaces/customers/<CST...>/<MWO...>/.unfogy/config.yaml
```

The MWO `.unfogy/config.yaml` is the single declarative desired-state input for
provisioning and deployment. It contains no credentials, secrets, live status,
leases, approvals or provider runtime state. Control Plane runtime records
remain authoritative for allocation, revision, checkpoints, audit and live
provider state.

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
