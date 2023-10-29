import Service from "../../classes/Service"

import Send from "../../functions/Responses"

import { ConvertNumberToDatabaseStageEnum } from "../../enums/DatabaseStageEnum"
import IService from "../../interfaces/IService"

/**
 * Service de configuração e validação do banco.
 */
export default class DatabaseService extends Service implements IService
{
    Action : string = "Configuração da Base de Dados"
    Schemas : string[] = ["production", "staging", "testing"]

    constructor(service : Service)
    {
        super(service.REQ, service.RES, ConvertNumberToDatabaseStageEnum(parseInt(service.DB_stage)))
    }

    CheckBody(body: any) {
        // Não há corpo de requisição para DatabaseService
        throw new Error("Method not implemented.")
    }

    async CheckDatabaseStatus()
    {
        return await this.DB_connection.query(`SELECT sql_commands_created FROM ${ this.DB_stage }.parameters`)
            .then(result => {
                if (result.rows[0]["sql_commands_created"] == false)
                {
                    return this.FoundCuiCodeSystemsDatabase()
                        .then(() => {
                            Send.Created(this.RES, "Banco de dados configurado com sucesso.", this.Action)
                        })
                        .catch(ex => {
                            Send.Error(this.RES, `Houve um erro ao configurar o banco de dados. Erro: ${ (ex as Error).message }`, this.Action)
                        })
                }
                return Send.Ok(this.RES, "Banco de dados já configurado.", this.Action)
            })
            .catch(async () => {
                return this.FoundCuiCodeSystemsDatabase()
                    .then(() => {
                        Send.Created(this.RES, "Banco de dados configurado com sucesso.", this.Action)
                    })
                    .catch(ex => {
                        Send.Error(this.RES, `Houve um erro ao configurar o banco de dados. Erro: ${ (ex as Error).message }`, this.Action)
                    })
            })
    }

    private async FoundCuiCodeSystemsDatabase()
    {
        await this.CreateRootSql()

        for (let _schema in this.Schemas)
        {
            const schema = this.Schemas[_schema]

            await this.CreateParameters(schema)
            await this.CreateUser(schema)
            await this.CreateGroup(schema)
            await this.CreateBoard(schema)
            await this.CreateSolicitations(schema)
            await this.CreateCron(schema)
            await this.CreateHestia(schema)
            await this.CreateMoney(schema)
            await this.CreateLevels(schema)
        }
    }

    // Criação dos Schemas.
    private async CreateRootSql()
    {
        try
        {
            await this.DB_connection.query(`
                CREATE SCHEMA production;
                CREATE SCHEMA staging;
                CREATE SCHEMA testing;
            `)
        } catch { }
    }

    // Criação da tabela parâmetros.
    private async CreateParameters(schema : string)
    {
        try
        {
            await this.DB_connection.query(`
                CREATE TABLE IF NOT EXISTS "${ schema }"."parameters"(
                    id SERIAL PRIMARY KEY,
                    sql_commands_created boolean NOT NULL,
                    system_under_maintence boolean NOT NULL
                );
                
                INSERT INTO "${ schema }"."parameters"
                (id, sql_commands_created, system_under_maintence)
                VALUES
                (1, true, false)
            `)
        } catch { }
    }

    // Criação do Módulo Usuários.
    private async CreateUser(schema : string)
    {
        try
        {
            await this.DB_connection.query(`
                CREATE TABLE IF NOT EXISTS "${ schema }"."permission_levels"(
                    id int PRIMARY KEY,
                    description varchar
                );
                
                INSERT INTO "${ schema }"."permission_levels" VALUES
                (4, 'Root'),
                (3, 'Adm'),
                (2, 'Member'),
                (1, 'Guest');
                
                CREATE TABLE IF NOT EXISTS "${ schema }"."sexs"(
                    id int PRIMARY KEY,
                    description varchar
                );
                
                INSERT INTO "${ schema }"."sexs" VALUES
                (1, 'Masculino'),
                (2, 'Feminino'),
                (3, 'Outro');

                CREATE TABLE IF NOT EXISTS "${ schema }"."users"(
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
                    created_date timestamp NOT NULL DEFAULT now(),
                    active boolean NOT NULL DEFAULT TRUE,
                    deleted boolean NOT NULL DEFAULT FALSE,
                    PRIMARY KEY (id),
                    FOREIGN KEY (sex) REFERENCES "${ schema }"."sexs" (id),
                    FOREIGN KEY (permission_level) REFERENCES "${ schema }"."permission_levels" (id)
                );

                CREATE TABLE IF NOT EXISTS "${ schema }"."email_approvals"(
                    id SERIAL PRIMARY KEY,
                    user_id int NOT NULL,
                    email varchar NOT NULL,
                    approved bool NOT NULL,
                    approved_date timestamp DEFAULT NULL,
                    created timestamp DEFAULT now(),
                    FOREIGN KEY (user_id) REFERENCES "${ schema }"."users" (id)
                );
                
                CREATE OR REPLACE PROCEDURE "${ schema }".approve_user_email(db_stage varchar, _user_id int, approval_id int)
                LANGUAGE plpgsql AS 
                $$
                BEGIN 
                    IF db_stage = 'testing' THEN 
                        UPDATE "testing"."email_approvals" em
                        SET 
                            approved = TRUE,
                            approved_date = now()
                        WHERE
                            user_id = $2 AND
                            id = $3;
                
                        UPDATE "testing"."users"
                        SET email_approved = TRUE 
                        WHERE id = $2;
                    
                    ELSEIF db_stage = 'staging' THEN 
                        UPDATE staging."email_approvals"
                        SET 
                            approved = TRUE,
                            approved_date = now() 
                        WHERE 
                            user_id = $2 AND
                            id = $3;
                
                        UPDATE staging."users"
                        SET email_approved = TRUE 
                        WHERE id = $2;
                
                    ELSEIF db_stage = 'production' THEN 
                        UPDATE production."email_approvals"
                        SET
                            approved = TRUE,
                            approved_date = now() 
                        WHERE 
                            user_id = $2 AND
                            id = $3;
                
                        UPDATE production."users"
                        SET email_approved = TRUE 
                        WHERE id = $2;
                    
                    ELSE
                        RAISE info 'db_stage: % inválido.', db_stage;
                    
                    END IF;
                END;
                $$;
            `)
        } catch { }
    }

    // Criação do Módulo Grupos.
    private async CreateGroup(schema : string)
    { }

    // Criação do Módulo Board.
    private async CreateBoard(schema : string)
    { }

    // Criação do Módulo Solicitações.
    private async CreateSolicitations(schema : string)
    { }

    // Criação do Módulo CRON.
    private async CreateCron(schema : string)
    { }

    // Criação do Módulo Héstia.
    private async CreateHestia(schema : string)
    { }

    // Criação do módulo de dinheiro.
    private async CreateMoney(schema : string)
    { }

    // Criação do módulo de níveis de usuário.
    private async CreateLevels(schema : string)
    { }
}