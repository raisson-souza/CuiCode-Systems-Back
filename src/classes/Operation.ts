import { Client } from "pg"

import User from "./User"

import IOperation from "../interfaces/IOperation"

/**
 * Contains all basic info for a operation.
 * @param User User to perform operation.
 * @param DB_connection DB Connection.
 */
abstract class Operation implements IOperation
{
    protected User : User | null
    protected DB_connection : Client

    constructor
    (
        user : User | null,
        db_connection : Client
    )
    {
        this.User = user
        this.DB_connection = db_connection
    }

    PerformOperation()
    {
        throw new Error("Method not implemented.")
    }
}

export default Operation