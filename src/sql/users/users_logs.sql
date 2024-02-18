CREATE TABLE "users_logs"(  
    "id" SERIAL,
    "user_id" INT NOT NULL,
    "change" JSONB NOT NULL,
    "date" TIMESTAMP DEFAULT NOW(),
    "modified_by" INT NOT NULL,
    "adm_change" BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES "users" (id),
    FOREIGN KEY (modified_by) REFERENCES "users" (id)
);