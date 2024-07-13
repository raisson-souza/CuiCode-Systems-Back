import { FoundCuiCodeSystemsDatabaseProps } from "./types/DatabaseServiceProps"

import IsNil from "../../functions/logic/IsNil"

import SystemService from "./SystemService"

export default abstract class DatabaseService
{
    /** Cria a base de dados do sistema. */
    static async FoundCuiCodeSystemsDatabase(props : FoundCuiCodeSystemsDatabaseProps)
    {
        const foundDatabase = async () => {
            await Promise.all([
                await this.CreateParameters({ Db: props.Db }),
                await this.CreateModules({ Db: props.Db }),
                await this.CreateSystemStyles({ Db: props.Db }),
                await this.CreateUsers({ Db: props.Db }),
                await this.CreateMorfeus({ Db: props.Db }),
                await this.CreateGroups({ Db: props.Db }),
                await this.CreateBoards({ Db: props.Db }),
                await this.CreateSolicitations({ Db: props.Db }),
                await this.CreateHestia({ Db: props.Db }),
                await this.CreateMinerva({ Db: props.Db }),
            ])
                .then(() => { })
                .catch(ex => { throw new Error(ex.message) })
        }

        try
        {
            const parameters = await SystemService.GetParameters({ Db: props.Db })

            if (IsNil(parameters))
                await foundDatabase()
        }
        catch
        {
            await foundDatabase()
        }
    }

    /** Cria a base de dados dos logs de erro do sistema. */
    static async CreateErrorLogDatabase(props : FoundCuiCodeSystemsDatabaseProps)
    {
        // await Promise.resolve(await ErrorService.List({ Db: props.Db }))
        //     .then(() => {
        //         console.log("SUCESSO")
        //     })
        //     .catch(async () => {
        //         const query = `
        //             CREATE TABLE "erros_logs" (
        //                 "id" INTEGER PRIMARY KEY AUTOINCREMENT,
        //                 "data" DATE NOT NULL DEFAULT (CURRENT_TIMESTAMP),
        //                 "message" TEXT NOT NULL
        //             );
        //         `
        //         props.Db.SqliteDb.run(query, ex => {
        //             if (!IsNil(ex))
        //                 throw new Error(ex!.message)
        //         })
        //     })
    }

    // CRIAÇÃO DA BASE DE DADOS ------------------------------------------

    /** Cria Parameters */
    private static async CreateParameters(props : FoundCuiCodeSystemsDatabaseProps)
    {
        await props.Db.PostgresDb.query(`
            CREATE TABLE IF NOT EXISTS "parameters"(
                "id" SERIAL,
                "sql_commands_created" BOOLEAN NOT NULL DEFAULT TRUE,
                "system_under_maintence" BOOLEAN NOT NULL DEFAULT FALSE,
                "special_system_style_on" BOOLEAN NOT NULL DEFAULT FALSE,
                PRIMARY KEY (id)
            );

            INSERT INTO "parameters" (id) VALUES (1);
        `)
        .then(() => { })
        .catch(ex => { throw new Error(ex.message) })
    }

    /** Cria o gerenciamento dos módulos */
    private static async CreateModules(props : FoundCuiCodeSystemsDatabaseProps)
    {
        await props.Db.PostgresDb.query(`
            CREATE TABLE IF NOT EXISTS "modules"(
                "id" SERIAL,
                "module" VARCHAR(30) NOT NULL UNIQUE,
                "active" BOOLEAN NOT NULL DEFAULT TRUE,
                PRIMARY KEY (id)
            );
            
            INSERT INTO "modules" (id, module) VALUES
            (2, 'board'),
            (3, 'morfeus'),
            (4, 'chats'),
            (5, 'solicitations'),
            (7, 'cron'),
            (8, 'hestia'),
            (9, 'minerva'),
            (10, 'donation');
        `)
        .then(() => { })
        .catch(ex => { throw new Error(ex.message) })
    }

    /** Cria SystemStyles */
    private static async CreateSystemStyles(props : FoundCuiCodeSystemsDatabaseProps)
    {
        await props.Db.PostgresDb.query(`
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
        .then(() => { })
        .catch(ex => { throw new Error(ex.message) })
    }

    /** Cria Users */
    private static async CreateUsers(props : FoundCuiCodeSystemsDatabaseProps)
    {
        await props.Db.PostgresDb.query(`
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

            CREATE TABLE IF NOT EXISTS "users_account_restorations"(
                "id" SERIAL,
                "jwt" VARCHAR NOT NULL,
                "user_id" INT NOT NULL,
                "user_email" VARCHAR(100),
                "created" TIMESTAMP NOT NULL DEFAULT now(),
                "completed" BOOL NOT NULL DEFAULT false,
                "expired" BOOL NOT NULL DEFAULT false,
                PRIMARY KEY (id),
                FOREIGN KEY (user_id) REFERENCES users (id)
            );
        `)
        .then(() => { })
        .catch(ex => { throw new Error(ex.message) })
    }

    /** Cria Morfeus */
    private static async CreateMorfeus(props : FoundCuiCodeSystemsDatabaseProps)
    { }

    /** Cria Groups */
    private static async CreateGroups(props : FoundCuiCodeSystemsDatabaseProps)
    { }

    /** Cria Boards */
    private static async CreateBoards(props : FoundCuiCodeSystemsDatabaseProps)
    { }

    /** Cria Solicitations */
    private static async CreateSolicitations(props : FoundCuiCodeSystemsDatabaseProps)
    { }

    /** Cria Hestia */
    private static async CreateHestia(props : FoundCuiCodeSystemsDatabaseProps)
    { }

    /** Cria Minerva */
    private static async CreateMinerva(props : FoundCuiCodeSystemsDatabaseProps)
    { }
}