CREATE TABLE IF NOT EXISTS parameters(
    id SERIAL PRIMARY KEY,
    sql_commands_created boolean NOT NULL DEFAULT TRUE,
    system_under_maintence boolean NOT NULL DEFAULT FALSE,
    special_system_style_on boolean NOT NULL DEFAULT FALSE
);

INSERT INTO parameters (id) VALUES (1);