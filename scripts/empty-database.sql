-- Read-only proof for an initial application installation on native Supabase.
DO $$ DECLARE
native_schemas constant text[] := ARRAY['information_schema','auth','storage','extensions','realtime','_realtime','_analytics','supabase_functions','supabase_migrations','unfogy_migrations','vault','graphql','graphql_public','pgbouncer','net','pgsodium','pgsodium_masks'];
BEGIN
IF EXISTS (
  SELECT 1 FROM pg_class c JOIN pg_namespace s ON s.oid=c.relnamespace
  WHERE c.relkind IN ('r','p','v','m','S','f') AND s.nspname !~ '^pg_'
    AND s.nspname <> ALL(native_schemas)
    AND NOT EXISTS (SELECT 1 FROM pg_depend d WHERE d.objid=c.oid AND d.classid='pg_class'::regclass AND d.deptype='e')
) THEN RAISE EXCEPTION 'Application objects exist'; END IF;
IF EXISTS (
  SELECT 1 FROM pg_proc p JOIN pg_namespace s ON s.oid=p.pronamespace
  WHERE s.nspname !~ '^pg_' AND s.nspname <> ALL(native_schemas)
    AND NOT EXISTS (SELECT 1 FROM pg_depend d WHERE d.objid=p.oid AND d.classid='pg_proc'::regclass AND d.deptype='e')
) THEN RAISE EXCEPTION 'Application functions exist'; END IF;
IF EXISTS (SELECT 1 FROM auth.users) THEN RAISE EXCEPTION 'Auth users exist'; END IF;
IF EXISTS (SELECT 1 FROM storage.objects) THEN RAISE EXCEPTION 'Storage objects exist'; END IF;
IF to_regclass('supabase_migrations.schema_migrations') IS NOT NULL THEN
  IF to_regclass('unfogy_migrations.migration_checksums') IS NULL THEN RAISE EXCEPTION 'Incomplete migration history'; END IF;
  IF EXISTS (SELECT 1 FROM supabase_migrations.schema_migrations) OR EXISTS (SELECT 1 FROM unfogy_migrations.migration_checksums) THEN
    RAISE EXCEPTION 'Migration history exists';
  END IF;
ELSIF to_regclass('unfogy_migrations.migration_checksums') IS NOT NULL THEN RAISE EXCEPTION 'Incomplete migration history';
END IF;
END $$;
