CREATE TABLE IF NOT EXISTS "parameters"(
    "id" SERIAL,
    "sql_commands_created" BOOLEAN NOT NULL DEFAULT TRUE,
    "system_under_maintence" BOOLEAN NOT NULL DEFAULT FALSE,
    "special_system_style_on" BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (id)
);

INSERT INTO "parameters" (id) VALUES (1);