CREATE TABLE IF NOT EXISTS "email_approvals"(
	"id" SERIAL,
	"user_id" INT NOT NULL,
	"email" VARCHAR(100) NOT NULL,
	"approved" BOOLEAN NOT NULL,
	"approved_date" TIMESTAMP DEFAULT NULL,
	"created" TIMESTAMP DEFAULT NOW(),
	PRIMARY KEY (id),
	FOREIGN KEY (user_id) REFERENCES "users" (id)
);

CREATE OR REPLACE PROCEDURE "approve_user_email"(_user_id INT, approval_id INT)
LANGUAGE plpgsql AS 
$$
BEGIN 
	UPDATE
		"email_approvals"
	SET 
		"approved" = TRUE,
		"approved_date" = NOW()
	WHERE
		"user_id" = _user_id AND
		"id" = approval_id;

	UPDATE
		"users"
	SET
		"email_approved" = TRUE 
	WHERE
		"id" = _user_id;
END;
$$;