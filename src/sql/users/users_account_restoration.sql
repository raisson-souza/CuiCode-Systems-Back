CREATE TABLE IF NOT EXISTS "user_account_restorations"(
    "id" SERIAL,
    "jwt" VARCHAR NOT NULL,
    "user_id" INT NOT NULL,
    "user_email" VARCHAR(100),
    "created" TIMESTAMP NOT NULL DEFAULT now(),
    "completed" BOOL NOT NULL DEFAULT false,
    "expired" BOOL NOT NULL DEFAULT false,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users (id)
)