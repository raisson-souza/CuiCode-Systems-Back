CREATE TABLE IF NOT EXISTS testing.email_approvals(
    id SERIAL PRIMARY KEY,
    user_id int NOT NULL,
    email varchar NOT NULL,
    approved bool NOT NULL,
    created timestamp DEFAULT now()::timestamp,
    FOREIGN KEY (user_id) REFERENCES testing.users (id),
    FOREIGN KEY (email) REFERENCES testing.users (email)
);

CREATE OR REPLACE PROCEDURE approve_user_email(db_stage varchar, _user_id int)
LANGUAGE plpgsql AS 
$$
BEGIN 
	IF db_stage = 'testing' THEN 
		UPDATE testing.email_approvals em
		SET approved = TRUE 
		WHERE user_id = $2;

		UPDATE testing.users
		SET email_approved = TRUE 
		WHERE id = $2;
	
	ELSEIF db_stage = 'staging' THEN 
		UPDATE staging.email_approvals
		SET approved = TRUE 
		WHERE user_id = $2;

		UPDATE staging.users
		SET email_approved = TRUE 
		WHERE id = $2;

	ELSEIF db_stage = 'production' THEN 
		UPDATE production.email_approvals
		SET approved = TRUE 
		WHERE user_id = $2;

		UPDATE production.users
		SET email_approved = TRUE 
		WHERE id = $2;
	
	ELSE
		RAISE info 'db_stage: % inválido.', db_stage;
	
	END IF;
END;
$$;
