CREATE TABLE IF NOT EXISTS system_styles (
    id serial PRIMARY KEY,
    style_name VARCHAR(50) NOT NULL,
    logo TEXT NOT NULL,
    header_color VARCHAR(10) NOT NULL,
    footer_color VARCHAR(10) NOT NULL,
    background_style INT NOT NULL,
    popup_style INT NOT NULL,
    initial_day INT NOT NULL,
    initial_time time NOT NULL,
    final_day INT NOT NULL,
    final_time time NOT NULL,
    is_special BOOLEAN NOT NULL DEFAULT FALSE,
    active BOOLEAN NOT NULL DEFAULT TRUE
)

INSERT INTO system_styles
(style_name, logo, header_color, footer_color, background_style, popup_style, initial_day, initial_time, final_day, final_time)
VALUES
('DIA', 'Logo Dia', '#0091CC', '#3394BB', 1, 1, 1, '08:00:00', 7, '17:59:59')

INSERT INTO system_styles
(style_name, logo, header_color, footer_color, background_style, popup_style, initial_day, initial_time, final_day, final_time)
VALUES
('NOITE', 'Logo Noite', '#0023A6', '#1F368C', 1, 1, 1, '18:00:00', 7, '07:59:59')