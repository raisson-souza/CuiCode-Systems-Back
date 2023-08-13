-- not nulls e validações
-- campos TEXT para foto base64
-- tabelas para tipos (user level tambem)

CREATE TABLE IF NOT EXISTS testing."users"(
	id SERIAL,
	username varchar(20),
	"name" varchar(100),
	birthdate DATE,
	sex int,
	email varchar(100),
	recovery_email varchar(100),
	phone varchar(20),
	"password" varchar(100),
	password_hint varchar(100),
	permission_level int,
	created_date DATE,
	active boolean,
	deleted boolean,
	PRIMARY KEY (id)
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