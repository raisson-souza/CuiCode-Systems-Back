CREATE TABLE IF NOT EXISTS "system_styles"(
    "id" SERIAL,
    "active" BOOLEAN NOT NULL DEFAULT TRUE,
    "style_name" VARCHAR(50) NOT NULL,
    "is_special" BOOLEAN NOT NULL DEFAULT FALSE,
    "primary_color" VARCHAR(50) NOT NULL,
    "secondary_color" VARCHAR(50) NOT NULL,
    "terciary_color" VARCHAR(50) NOT NULL,
    "background_primary_color" VARCHAR(50) NOT NULL,
    "background_secondary_color" VARCHAR(50) NOT NULL,
    "header_color" VARCHAR(50) NOT NULL,
    "modules_color" VARCHAR(50) NOT NULL,
    "text_color" VARCHAR(50) NOT NULL,
    "final_day" INT NOT NULL,
    "final_time" TIME NOT NULL,
    "initial_day" INT NOT NULL,
    "initial_time" TIME NOT NULL,
    "logo_color" VARCHAR(6) NOT NULL DEFAULT 'black',
    "logo_type" VARCHAR(6) NOT NULL DEFAULT 'right',
    PRIMARY KEY (id)
);

INSERT INTO "system_styles"
(style_name, primary_color, secondary_color, terciary_color, background_primary_color, background_secondary_color, header_color, modules_color, text_color, final_day, initial_time, initial_day, final_time, logo_color, logo_type)
VALUES
('day default database', '#91CCFF', '#55B0FE', '#0089FF', '#7A7A7A', '#B5B5B5', '#FFFFFF', '#D5D5D5', '#000000', 1, '08:00:00', 7, '17:59:59', 'black', 'left'),
('night default database', '#AC00EA', '#991CC6', '#832EA2', '#6A367D', '#4F3359', '#5E0080', '#53146A', '#D1D1D1', 1, '18:00:00', 7, '07:59:59', 'white', 'right')