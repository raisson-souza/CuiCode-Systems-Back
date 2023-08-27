CREATE TABLE IF NOT EXISTS testing.email_approvals(
    id SERIAL PRIMARY KEY,
    user_id int NOT NULL,
    email varchar NOT NULL,
    aproved bool NOT NULL,
    FOREIGN KEY (user_id) REFERENCES "users" (id),
    FOREIGN KEY (email) REFERENCES "users" (email)
)
