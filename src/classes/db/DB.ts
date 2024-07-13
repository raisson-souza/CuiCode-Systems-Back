import { Client } from "pg"
import { Database } from "sqlite3"

import env from "../../config/Env"

import IDB from "./IDB"

import IsNil from "../../functions/logic/IsNil"

export default class DB implements IDB
{
    PostgresDb : Client

    async ConnectPostgres() : Promise<void>
    {
        this.PostgresDb = new Client(env.DatabaseConfig() as any)
        
        await this.PostgresDb.connect()
        .then(() => { })
        .catch((ex) => {
            throw new Error(ex.message)
        })
    }

    async DisconnectPostgres() : Promise<void>
    {
        await this.PostgresDb.end()
    }

    SqliteDb : Database

    async ConnectSqlite() : Promise<void>
    {
        this.SqliteDb = new Database(__dirname.split("src")[0] + 'db.sqlite3', (ex) => {
            if (!IsNil(ex))
                throw new Error(ex!.message);
        })
    }

    async DisconnectSqlite() : Promise<void>
    {
        await this.SqliteDb.close()
    }

    FirebaseDb: never
    async ConnectFirebase() { }
    DisconnectFirebase() : void { }
}