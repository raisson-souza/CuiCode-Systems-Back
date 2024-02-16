import { Client } from "pg"

interface IEntityWithForeignKey
{
    GetForeignKey(db : Client) : void
}

export default IEntityWithForeignKey