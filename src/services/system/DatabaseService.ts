import ResponseMessage from "../../classes/system/ResponseMessage"

import Exception from "../../classes/custom/Exception"
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

    CheckParams() { }

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
            Exception.UnexpectedError((ex as Error).message, this.Action)
        }
        finally
        {
            this.DB_connection.end()
        }
    }

    private async FoundCuiCodeSystemsDatabase()
    {
        await this.CreateParameters()
        await this.CreateSystemStyles()
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
                    "id" SERIAL,
                    "sql_commands_created" BOOLEAN NOT NULL DEFAULT TRUE,
                    "system_under_maintence" BOOLEAN NOT NULL DEFAULT FALSE,
                    "special_system_style_on" BOOLEAN NOT NULL DEFAULT FALSE,
                    PRIMARY KEY (id)
                );

                INSERT INTO "parameters" (id) VALUES (1);
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
                    "id" INT,
                    "description" varchar,
                    PRIMARY KEY (id)
                );

                INSERT INTO "permission_levels" VALUES
                (4, 'Root'),
                (3, 'Adm'),
                (2, 'Member'),
                (1, 'Guest');

                CREATE TABLE IF NOT EXISTS "sexs"(
                    "id" INT,
                    "description" varchar,
                    PRIMARY KEY (id)
                );

                INSERT INTO "sexs" VALUES
                (1, 'Masculino'),
                (2, 'Feminino'),
                (3, 'Outro');

                CREATE TABLE IF NOT EXISTS "users"(
                    "id" SERIAL,
                    "username" VARCHAR(20) NOT NULL UNIQUE,
                    "name" VARCHAR(100) NOT NULL,
                    "birthdate" DATE NOT NULL,
                    "sex" INT NOT NULL,
                    "email" VARCHAR(100) NOT NULL UNIQUE,
                    "recovery_email" VARCHAR(100) UNIQUE,
                    "phone" VARCHAR(20) UNIQUE,
                    "password" VARCHAR(100) NOT NULL,
                    "password_hint" VARCHAR(100) NOT NULL,
                    "email_approved" BOOLEAN DEFAULT FALSE,
                    "permission_level" INT NOT NULL DEFAULT 2,
                    "created" TIMESTAMP NOT NULL DEFAULT now(),
                    "active" BOOLEAN NOT NULL DEFAULT TRUE,
                    "deleted" BOOLEAN NOT NULL DEFAULT FALSE,
                    "modified" TIMESTAMP DEFAULT NULL,
                    "modified_by" INT DEFAULT NULL,
                    PRIMARY KEY (id),
                    FOREIGN KEY (sex) REFERENCES "sexs" (id),
                    FOREIGN KEY (permission_level) REFERENCES "permission_levels" (id),
                    FOREIGN KEY (modified_by) REFERENCES "users" (id)
                );

                CREATE TABLE IF NOT EXISTS "email_approvals"(
                    "id" SERIAL,
                    "user_id" INT NOT NULL,
                    "email" VARCHAR(100) NOT NULL,
                    "approved" BOOLEAN NOT NULL,
                    "approved_date" TIMESTAMP DEFAULT NULL,
                    "created" TIMESTAMP DEFAULT now(),
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
                        "approved_date" = now()
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

                CREATE TABLE "users_logs"(  
                    "id" SERIAL,
                    "user_id" INT NOT NULL,
                    "change" JSONB NOT NULL,
                    "date" TIMESTAMP DEFAULT NOW(),
                    "modified_by" INT NOT NULL,
                    "adm_change" BOOLEAN DEFAULT FALSE,
                    PRIMARY KEY (id),
                    FOREIGN KEY (user_id) REFERENCES "users" (id),
                    FOREIGN KEY (modified_by) REFERENCES "users" (id)
                );

                CREATE TABLE IF NOT EXISTS "users_photos"(
                    "id" SERIAL,
                    "user_id" INT NOT NULL UNIQUE,
                    "photo_base_64" TEXT DEFAULT NULL
                    "created" TIMESTAMP NOT NULL DEFAULT now(),
                    "modified" TIMESTAMP DEFAULT NULL,
                    PRIMARY KEY (id),
                    FOREIGN KEY (user_id) REFERENCES "users" (id)
                );
            `)
        } catch { }
    }

    // Criação dos estilos do sistema.
    private async CreateSystemStyles()
    {
        try
        {
            await this.DB_connection.query(`
                CREATE TABLE IF NOT EXISTS "system_styles" (
                    "id" SERIAL,
                    "style_name" VARCHAR(50) NOT NULL,
                    "background_primary_color" VARCHAR(50) NOT NULL,
                    "background_secondary_color" VARCHAR(50) NOT NULL,
                    "background_terciary_color" VARCHAR(50) NOT NULL,
                    "footer_color" VARCHAR(50) NOT NULL,
                    "header_color" VARCHAR(50) NOT NULL,
                    "modules_column_color" VARCHAR(50) NOT NULL,
                    "primary_color" VARCHAR(50) NOT NULL,
                    "secondary_color" VARCHAR(50) NOT NULL,
                    "terciary_color" VARCHAR(50) NOT NULL,
                    "text_color" VARCHAR(50) NOT NULL,
                    "logo" TEXT NOT NULL,
                    "is_special" BOOLEAN NOT NULL DEFAULT FALSE,
                    "initial_day" INT NOT NULL,
                    "final_day" INT NOT NULL,
                    "initial_time" TIME NOT NULL,
                    "final_time" TIME NOT NULL,
                    "active" BOOLEAN NOT NULL DEFAULT TRUE,
                    PRIMARY KEY (id)
                );
                
                INSERT INTO "system_styles"
                (style_name, header_color, footer_color, background_primary_color, background_secondary_color, background_terciary_color, primary_color, secondary_color, terciary_color, modules_column_color, text_color, initial_day, initial_time, final_day, final_time, logo)
                VALUES
                ('DIA', '#eefcfc', '#def9fa', '#adf2f4', '#bdf4f6', '#cdf7f8', '#a2c4e6', '#1dd5db', '#8eeaed', '#5be5e9', 'black', 1, '08:00:00', 7, '17:59:59', '')
                ('NOITE', '#4c3781', '#402e6b', '#332556', '#261b40', '#19122b', '#805dd7', '#7353c1', '#664aac', '#0c0915', 'white', 1, '18:00:00', 7, '07:59:59', '')
            `)
        }
        catch { }
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