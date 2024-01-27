CREATE TABLE IF NOT EXISTS "groups"(
	id SERIAL,
	"name" varchar(100),
	creator_id int,
	"type" int,
	created DATE,
	active boolean,
	deleted_date DATE,
	deleted DATE,
	PRIMARY KEY (id),
	FOREIGN KEY (creator_id) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS groups_relation(
	id SERIAL,
	user_id int,
	group_id int,
	entry_date DATE,
	deleted_date DATE,
	PRIMARY KEY (id),
	FOREIGN KEY (user_id) REFERENCES users (id),
	FOREIGN KEY (group_id) REFERENCES "groups" (id)
);