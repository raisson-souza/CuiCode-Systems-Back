import { sign } from "jsonwebtoken"

import Env from "../../config/environment"

import ClientService from "../../classes/service/ClientService"

import User from "../../classes/User"
import UserAuth from "../../classes/UserAuth"

import IsUndNull from "../../functions/IsUndNull"
import Send from "../../functions/system/Send"

/**
 * Realiza o login e autenticação de um usuário.
 */
class LoginService extends ClientService
{
    Action : string = "Autenticação de Usuário."

    CheckBody()
    {
        const {
            email,
            password
        } = this.REQ.body

        if (IsUndNull(email) || IsUndNull(password))
            throw new Error("Um ou mais dados de autenticação estão ausentes.")

        this.USER_auth = new UserAuth({ "Email": email, "Password": password }, false, this.REQ.headers)
    }

    CheckQuery() { throw new Error("Method not implemented.") }

    async Operation()
    {
        try
        {
            this.CheckBody()

            const userDb = await Promise.resolve(this.FindUser())
                .then(user => { return user })
                .catch(ex => { throw new Error(ex) })

            if (this.USER_auth?.Password != userDb.Password)
                throw new Error("Senha de usuário incorreta.")

            const token = sign(
                {
                    id: userDb.Id,
                },
                Env.JWT_key,
                { expiresIn: "1d" }
            )

            Send.Ok(this.RES, { token: token, USER_auth: userDb }, this.Action)
        }
        catch (ex)
        {
            Send.Error(this.RES, `Houve um erro ao autenticar o usuário. Erro: ${ (ex as Error).message }`, this.Action)
        }
        finally
        {
            this.DB_connection.end()
        }
    }

    private async FindUser()
    {
        try
        {
            let query = `SELECT * FROM users WHERE email = '${ this.USER_auth?.Email }'`

            return await this.DB_connection.query(query)
                .then(result => {
                    if (result.rowCount == 0)
                        throw new Error("Usuário não encontrado.")

                    return new User(result.rows[0], true, false, false)
                })
                .catch(ex => {
                    throw new Error(ex.message)
                })
        }
        catch (ex)
        {
            throw new Error((ex as Error).message);
        }
    }
}

export default LoginService