CREATE TABLE IF NOT EXISTS parameters(
    id SERIAL PRIMARY KEY,
    sql_commands_created boolean NOT NULL,
    system_under_maintence boolean NOT NULL
);

INSERT INTO parametes
(id, sql_commands_created, system_under_maintence)
VALUES
(1, true, false);