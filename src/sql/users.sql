CREATE TABLE IF NOT EXISTS users(
	id SERIAL,
	username varchar(20) NOT NULL UNIQUE,
	"name" varchar(100) NOT NULL,
	birthdate DATE NOT NULL,
	sex int NOT NULL,
	email varchar(100) NOT NULL UNIQUE,
	recovery_email varchar(100) UNIQUE,
	phone varchar(20) UNIQUE,
	"password" varchar(100) NOT NULL,
	password_hint varchar(100) NOT NULL,
	email_approved bool DEFAULT FALSE,
	permission_level int NOT NULL DEFAULT 2,
	created timestamp NOT NULL DEFAULT now(),
	active boolean NOT NULL DEFAULT TRUE,
	deleted boolean NOT NULL DEFAULT FALSE,
    modified timestamp DEFAULT NULL,
    modified_by int DEFAULT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (sex) REFERENCES sexs (id),
	FOREIGN KEY (permission_level) REFERENCES permission_levels (id),
    FOREIGN KEY (modified_by) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS permission_levels(
	id int PRIMARY KEY,
	description varchar
);

INSERT INTO permission_levels VALUES
(4, 'Root'),
(3, 'Adm'),
(2, 'Member'),
(1, 'Guest');

CREATE TABLE IF NOT EXISTS sexs(
	id int PRIMARY KEY,
	description varchar
);

INSERT INTO sexs VALUES
(1, 'Masculino'),
(2, 'Feminino'),
(3, 'Outro');

CREATE TABLE users_logs(  
    id SERIAL,
    user_id int NOT NULL,
    "change" jsonb NOT NULL,
    "date" timestamp DEFAULT NOW(),
    adm_change BOOL DEFAULT FALSE,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users (id)
)

CREATE TABLE IF NOT EXISTS users_photos(
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    base_64 TEXT DEFAULT NULL,
    created timestamp NOT NULL DEFAULT now(),
    modified timestamp DEFAULT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id)
)

/*
CHAT
    id
    nome
    criador
    criação
    tipo
    ativo?
    exclusão
    detelado?

SOLICITAÇÃO
    id
    titulo
    descrição
    valor
    local
    criador
    responsável
    criação
    finalização
    inicio
    fim
    status
    tipo
    exclusão
    detelado?
    
RELAÇÃO CHAT
    id
    usuario
    chat
    mensagem
    criação
    editada?
    excluida?
    exclusão

QUADRO
    id
    usuario
    mensagem
    criação
    editada?
    excluida?
    exclusão

RELAÇÃO QUADRO
    id
    usuario
    quadro
    curtida?
    comentario
    editada?
    excluida?
    
HISTÓRICO SOLICITAÇÕES
    id registro
    data do registro
    ... (cópia completa da solicitação)
*/