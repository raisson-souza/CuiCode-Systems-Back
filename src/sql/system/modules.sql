CREATE TABLE IF NOT EXISTS "modules"(
    "id" SERIAL,
    "module" VARCHAR(30) NOT NULL UNIQUE,
    "active" BOOLEAN NOT NULL DEFAULT TRUE,
    PRIMARY KEY (id)
);

INSERT INTO "modules" (id, module) VALUES
(2, 'board'),
(3, 'morfeus'),
(4, 'chats'),
(5, 'solicitations'),
(7, 'cron'),
(8, 'hestia'),
(9, 'minerva'),
(10, 'donation');