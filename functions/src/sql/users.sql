CREATE TABLE IF NOT EXISTS testing."users"(
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
	accepted_by int DEFAULT NULL,
	email_approved bool DEFAULT FALSE,
	photo_base_64 TEXT DEFAULT NULL,
	permission_level int NOT NULL,
	created_date timestamp NOT NULL,
	active boolean NOT NULL,
	deleted boolean NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (sex) REFERENCES sexs (id),
	FOREIGN KEY (permission_level) REFERENCES permission_levels (id)
)

CREATE TABLE IF NOT EXISTS testing.permission_levels(
	id int PRIMARY KEY,
	description varchar
)

INSERT INTO testing.permission_levels VALUES
(1, 'Root'),
(2, 'Adm'),
(3, 'Member'),
(4, 'Guest')

CREATE TABLE IF NOT EXISTS testing.sexs(
	id int PRIMARY KEY,
	description varchar
)

INSERT INTO testing.sexs VALUES
(1, 'Masculino'),
(2, 'Feminino'),
(3, 'Outro')

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