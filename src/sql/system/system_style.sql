CREATE TABLE IF NOT EXISTS "system_styles" (
    "id" SERIAL,
    "style_name" VARCHAR(50) NOT NULL,
    "background_primary_color" VARCHAR(50) NOT NULL,
    "background_secondary_color" VARCHAR(50) NOT NULL,
    "background_terciary_color" VARCHAR(50) NOT NULL,
    "footer_color" VARCHAR(50) NOT NULL,
    "header_color" VARCHAR(50) NOT NULL,
    "modules_column_color" VARCHAR(50) NOT NULL,
    "primary_color" VARCHAR(50) NOT NULL,
    "secondary_color" VARCHAR(50) NOT NULL,
    "terciary_color" VARCHAR(50) NOT NULL,
    "text_color" VARCHAR(50) NOT NULL,
    "logo" TEXT NOT NULL,
    "is_special" BOOLEAN NOT NULL DEFAULT FALSE,
    "initial_day" INT NOT NULL,
    "final_day" INT NOT NULL,
    "initial_time" TIME NOT NULL,
    "final_time" TIME NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT TRUE,
    PRIMARY KEY (id)
);

INSERT INTO "system_styles"
(style_name, header_color, footer_color, background_primary_color, background_secondary_color, background_terciary_color, primary_color, secondary_color, terciary_color, modules_column_color, text_color, initial_day, initial_time, final_day, final_time, logo)
VALUES
('DIA', '#eefcfc', '#def9fa', '#adf2f4', '#bdf4f6', '#cdf7f8', '#a2c4e6', '#1dd5db', '#8eeaed', '#5be5e9', 'black', 1, '08:00:00', 7, '17:59:59', ''),
('NOITE', '#4c3781', '#402e6b', '#332556', '#261b40', '#19122b', '#805dd7', '#7353c1', '#664aac', '#0c0915', 'white', 1, '18:00:00', 7, '07:59:59', '');