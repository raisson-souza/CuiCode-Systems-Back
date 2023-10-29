CREATE TABLE IF NOT EXISTS email_approvals(
	id SERIAL PRIMARY KEY,
	user_id int NOT NULL,
	email varchar NOT NULL,
	approved bool NOT NULL,
	approved_date timestamp DEFAULT NULL,
	created timestamp DEFAULT now(),
	FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE OR REPLACE PROCEDURE approve_user_email(db_stage varchar, _user_id int, approval_id int)
LANGUAGE plpgsql AS 
$$
BEGIN 
	IF db_stage = 'testing' THEN 
		UPDATE testing.email_approvals em
		SET 
			approved = TRUE,
			approved_date = now()
		WHERE
			user_id = $2 AND
			id = $3;

		UPDATE testing.users
		SET email_approved = TRUE 
		WHERE id = $2;
	
	ELSEIF db_stage = 'staging' THEN 
		UPDATE staging.email_approvals
		SET 
			approved = TRUE,
			approved_date = now() 
		WHERE 
			user_id = $2 AND
			id = $3;

		UPDATE staging.users
		SET email_approved = TRUE 
		WHERE id = $2;

	ELSEIF db_stage = 'production' THEN 
		UPDATE production.email_approvals
		SET
			approved = TRUE,
			approved_date = now() 
		WHERE 
			user_id = $2 AND
			id = $3;

		UPDATE production.users
		SET email_approved = TRUE 
		WHERE id = $2;
	
	ELSE
		RAISE info 'db_stage: % inválido.', db_stage;
	
	END IF;
END;
$$;
