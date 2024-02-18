CREATE TABLE IF NOT EXISTS "users_photos"(
    "id" SERIAL,
    "user_id" INT NOT NULL UNIQUE,
    "photo_base_64" TEXT DEFAULT NULL
    "created" TIMESTAMP NOT NULL DEFAULT NOW(),
    "modified" TIMESTAMP DEFAULT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES "users" (id)
);