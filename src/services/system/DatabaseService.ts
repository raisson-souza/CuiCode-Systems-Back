import ResponseMessage from "../../classes/DTOs/ResponseMessage"

import ServerService from "../../classes/service/ServerService"

import HttpStatusEnum from "../../enums/system/HttpStatusEnum"

/**
 * Service de configuração e validação do banco.
 */
class DatabaseService extends ServerService
{
    Action : string = "Configuração da Base de Dados."

    CheckQuery() { throw new Error("Method not implemented.") }

    CheckBody() { throw new Error("Method not implemented.") }

    async Operation()
    {
        try
        {
            this.AuthenticateRequestor()
    
            return await this.DB_connection.query(`SELECT sql_commands_created FROM parameters`)
                .then(result => {
                    if (result.rows[0]["sql_commands_created"] == false)
                    {
                        return this.FoundCuiCodeSystemsDatabase()
                            .then(() => {
                                ResponseMessage.Send(
                                    HttpStatusEnum.CREATED,
                                    "Banco de dados configurado com sucesso.",
                                    this.Action,
                                    this.RES
                                )
                            })
                            .catch(ex => {
                                throw new Error((ex as Error).message)
                            })
                    }
                    return ResponseMessage.Send(
                        HttpStatusEnum.ACCEPTED,
                        "Banco de dados já configurado.",
                        this.Action,
                        this.RES
                    )
                })
                .catch(async () => {
                    return this.FoundCuiCodeSystemsDatabase()
                        .then(() => {
                            ResponseMessage.Send(
                                HttpStatusEnum.CREATED,
                                "Banco de dados configurado com sucesso.",
                                this.Action,
                                this.RES
                            )
                        })
                        .catch(ex => {
                            throw new Error((ex as Error).message)
                        })
                })
        }
        catch (ex)
        {
            ResponseMessage.Send(
                HttpStatusEnum.INTERNAL_SERVER_ERROR,
                `Houve um erro ao configurar o banco. Erro: ${ (ex as Error).message }`,
                this.Action,
                this.RES
            )
        }
    }

    private async FoundCuiCodeSystemsDatabase()
    {
        await this.CreateParameters()
        await this.CreateUser()
        await this.CreateGroup()
        await this.CreateBoard()
        await this.CreateSolicitations()
        await this.CreateCron()
        await this.CreateHestia()
        await this.CreateMoney()
        await this.CreateLevels()
    }

    // Criação da tabela parâmetros.
    private async CreateParameters()
    {
        try
        {
            await this.DB_connection.query(`
                CREATE TABLE IF NOT EXISTS "parameters"(
                    id SERIAL PRIMARY KEY,
                    sql_commands_created boolean NOT NULL,
                    system_under_maintence boolean NOT NULL
                );
                
                INSERT INTO "parameters"
                (id, sql_commands_created, system_under_maintence)
                VALUES
                (1, true, false)
            `)
        } catch { }
    }

    // Criação do Módulo Usuários.
    private async CreateUser()
    {
        try
        {
            await this.DB_connection.query(`
                CREATE TABLE IF NOT EXISTS "permission_levels"(
                    id int PRIMARY KEY,
                    description varchar
                );
                
                INSERT INTO "permission_levels" VALUES
                (4, 'Root'),
                (3, 'Adm'),
                (2, 'Member'),
                (1, 'Guest');
                
                CREATE TABLE IF NOT EXISTS "sexs"(
                    id int PRIMARY KEY,
                    description varchar
                );
                
                INSERT INTO "sexs" VALUES
                (1, 'Masculino'),
                (2, 'Feminino'),
                (3, 'Outro');

                CREATE TABLE IF NOT EXISTS "users"(
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
                    photo_base_64 TEXT DEFAULT NULL,
                    permission_level int NOT NULL DEFAULT 2,
                    created timestamp NOT NULL DEFAULT now(),
                    active boolean NOT NULL DEFAULT TRUE,
                    deleted boolean NOT NULL DEFAULT FALSE,
                    modified timestamp DEFAULT NULL,
                    modified_by int DEFAULT NULL,
                    PRIMARY KEY (id),
                    FOREIGN KEY (sex) REFERENCES "sexs" (id),
                    FOREIGN KEY (permission_level) REFERENCES "permission_levels" (id),
                    FOREIGN KEY (modified_by) REFERENCES "users" (id)
                );

                CREATE TABLE IF NOT EXISTS "email_approvals"(
                    id SERIAL PRIMARY KEY,
                    user_id int NOT NULL,
                    email varchar NOT NULL,
                    approved bool NOT NULL,
                    approved_date timestamp DEFAULT NULL,
                    created timestamp DEFAULT now(),
                    FOREIGN KEY (user_id) REFERENCES "users" (id)
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

                CREATE TABLE IF NOT EXISTS "users_logs"(  
                    id SERIAL,
                    user_id int NOT NULL,
                    "change" jsonb NOT NULL,
                    "date" timestamp DEFAULT NOW(),
                    adm_change BOOL DEFAULT FALSE,
                    PRIMARY KEY (id),
                    FOREIGN KEY (user_id) REFERENCES "users" (id)
                );

                CREATE TABLE IF NOT EXISTS users_photos(
                    id SERIAL PRIMARY KEY,
                    user_id INT NOT NULL UNIQUE,
                    base_64 TEXT DEFAULT NULL,
                    created timestamp NOT NULL DEFAULT now(),
                    modified timestamp DEFAULT NULL,
                    FOREIGN KEY (user_id) REFERENCES users (id)
                )
            `)
        } catch { }
    }

    // Criação do Módulo Grupos.
    private async CreateGroup()
    { }

    // Criação do Módulo Board.
    private async CreateBoard()
    { }

    // Criação do Módulo Solicitações.
    private async CreateSolicitations()
    { }

    // Criação do Módulo CRON.
    private async CreateCron()
    { }

    // Criação do Módulo Héstia.
    private async CreateHestia()
    { }

    // Criação do módulo de dinheiro.
    private async CreateMoney()
    { }

    // Criação do módulo de níveis de usuário.
    private async CreateLevels()
    { }
}

export default DatabaseService