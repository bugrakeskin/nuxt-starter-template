# Declarative schemas

Keep the reviewed desired database state here. Add application tables only when
a customer-independent starter requirement exists; project domain tables belong
to the customer repository created from this template.

Every table exposed through the Data API must explicitly grant the required
roles, enable RLS, and define tested authorization policies.
