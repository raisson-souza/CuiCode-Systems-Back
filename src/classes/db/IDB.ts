import { Client } from "pg"
import { Database } from "sqlite3"

export default interface IDB
{
    /** Banco de dados Postgres */
    PostgresDb : Client
    ConnectPostgres() : Promise<void>
    DisconnectPostgres() : Promise<void>

    /** Banco de dados SqlLite */
    SqliteDb : Database
    ConnectSqlite() : Promise<void>
    DisconnectSqlite() : Promise<void>

    /** Banco de dados Firebase */
    FirebaseDb : never
    ConnectFirebase() : void
    DisconnectFirebase() : void
}