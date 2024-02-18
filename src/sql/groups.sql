CREATE TABLE IF NOT EXISTS "group_types"(
	"id" SERIAL,
	"name" VARCHAR(50) NOT NULL,
	"multiple_adms" BOOLEAN DEFAULT FALSE,
	"all_adms" BOOLEAN DEFAULT FALSE,
	"imediate_exclusion" BOOLEAN DEFAULT FALSE,
	PRIMARY KEY (id)
)

CREATE TABLE IF NOT EXISTS "groups"(
	"id" SERIAL,
	"name" varchar(100),
	"type" INT,
	"active" BOOLEAN,
	"created" DATE,
	"created_by" INT,
	"modified" DATE,
	"modified_by" INT,
	"deleted" BOOLEAN,
	"deleted_by" INT,
	"exclusion" DATE,
	PRIMARY KEY (id),
	FOREIGN KEY (created_by) REFERENCES "users" (id),
	FOREIGN KEY (modified_by) REFERENCES "users" (id),
	FOREIGN KEY (deleted_by) REFERENCES "users" (id)
);

CREATE TABLE IF NOT EXISTS "groups_relation"(
	"id" SERIAL,
	"user_id" INT NOT NULL,
	"group_id" INT NOT NULL,
	"active" BOOLEAN NOT NULL DEFAULT TRUE,
	"is_waiting_approval" BOOLEAN NOT NULL,
	"is_adm" BOOLEAN NOT NULL,
	"entry" DATE,
	"created" DATE NOT NULL DEFAULT NOW(),
	"removed" DATE,
	"removed_by" INT,
	"included_by" INT NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (user_id) REFERENCES "users" (id),
	FOREIGN KEY (group_id) REFERENCES "groups" (id),
	FOREIGN KEY (removed_by) REFERENCES "users" (id),
	FOREIGN KEY (included_by) REFERENCES "users" (id)
);