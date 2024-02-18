CREATE TABLE IF NOT EXISTS "permission_levels"(
	"id" INT,
	"description" varchar,
    PRIMARY KEY (id)
);

INSERT INTO "permission_levels" VALUES
(4, 'Root'),
(3, 'Adm'),
(2, 'Member'),
(1, 'Guest');

CREATE TABLE IF NOT EXISTS "sexs"(
	"id" INT,
	"description" varchar,
    PRIMARY KEY (id)
);

INSERT INTO "sexs" VALUES
(1, 'Masculino'),
(2, 'Feminino'),
(3, 'Outro');

CREATE TABLE IF NOT EXISTS "users"(
	"id" SERIAL,
	"username" VARCHAR(20) NOT NULL UNIQUE,
	"name" VARCHAR(100) NOT NULL,
	"birthdate" DATE NOT NULL,
	"sex" INT NOT NULL,
	"email" VARCHAR(100) NOT NULL UNIQUE,
	"recovery_email" VARCHAR(100) UNIQUE,
	"phone" VARCHAR(20) UNIQUE,
	"password" VARCHAR(100) NOT NULL,
	"password_hint" VARCHAR(100) NOT NULL,
	"email_approved" BOOLEAN DEFAULT FALSE,
	"permission_level" INT NOT NULL DEFAULT 2,
	"created" TIMESTAMP NOT NULL DEFAULT NOW(),
	"active" BOOLEAN NOT NULL DEFAULT TRUE,
	"deleted" BOOLEAN NOT NULL DEFAULT FALSE,
    "modified" TIMESTAMP DEFAULT NULL,
    "modified_by" INT DEFAULT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (sex) REFERENCES "sexs" (id),
	FOREIGN KEY (permission_level) REFERENCES "permission_levels" (id),
    FOREIGN KEY (modified_by) REFERENCES "users" (id)
);