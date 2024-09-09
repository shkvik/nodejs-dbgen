DO $$ 
DECLARE 
    r RECORD;
BEGIN
    -- Выполняем запрос для каждой таблицы в схеме public
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
END $$;