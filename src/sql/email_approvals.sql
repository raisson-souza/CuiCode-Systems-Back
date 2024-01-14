CREATE TABLE IF NOT EXISTS email_approvals(
	id SERIAL PRIMARY KEY,
	user_id int NOT NULL,
	email varchar NOT NULL,
	approved bool NOT NULL,
	approved_date timestamp DEFAULT NULL,
	created timestamp DEFAULT now(),
	FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE OR REPLACE PROCEDURE approve_user_email(_user_id int, approval_id int)
LANGUAGE plpgsql AS 
$$
BEGIN 
	UPDATE
		email_approvals em
	SET 
		approved = TRUE,
		approved_date = now()
	WHERE
		user_id = _user_id AND
		id = approval_id;

	UPDATE
		users
	SET
		email_approved = TRUE 
	WHERE
		id = _user_id;
END;
$$;