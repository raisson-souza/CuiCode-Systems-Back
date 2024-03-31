import { sign } from "jsonwebtoken"

import Env from "../../config/Env"

import ClientService from "../../classes/service/ClientService"
import Exception from "../../classes/custom/Exception"
import ResponseMessage from "../../classes/system/ResponseMessage"
import User from "../../classes/entities/user/User"
import UserAuth from "../../classes/entities/user/UserAuth"
import UserBase from "../../classes/bases/UserBase"

import IsUndNull from "../../functions/logic/IsUndNull"
import Sleep from "../../functions/security/Sleep"

import HttpStatusEnum from "../../enums/system/HttpStatusEnum"

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

        if (IsUndNull(email) || IsUndNull(password)) {
            ResponseMessage.SendNullField({
                expressResponse: this.RES,
                fields: ["email", "password"],
                log: this.Action
            })
        }

        this.USER_auth = new UserAuth({ "Email": email, "Password": password }, this.REQ.headers)
        this.USER_auth.EncryptPassword()
    }

    CheckQuery() { throw new Error("Method not implemented.") }

    CheckParams() { }

    async Operation()
    {
        try
        {
            this.CheckBody()

            const userDb = await this.FindUser()

            if (this.USER_auth!.Password != userDb.Password)
                throw new Error("Senha de usuário incorreta.")

            const userPhoto = await this.GetUserPhoto(userDb.Id)

            if (!IsUndNull(userPhoto))
                userDb.PhotoBase64 = userPhoto!

            const token = sign(
                {
                    UserAuthId: userDb.Id,
                },
                Env.JWT_key,
                { expiresIn: "3d" }
            )

            const response = {
                token: token,
                user: userDb
            }

            ResponseMessage.Send({
                status: HttpStatusEnum.OK,
                data: response,
                log: this.Action,
                expressResponse: this.RES
            })
        }
        catch (ex)
        {
            await Sleep()
            ResponseMessage.Send({
                status: HttpStatusEnum.INTERNAL_SERVER_ERROR,
                data: `Houve um erro no login. Erro: ${ (ex as Error).message }`,
                log: this.Action,
                expressResponse: this.RES
            })
            Exception.UnexpectedError((ex as Error).message, this.Action)
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
            let query = `SELECT * FROM users WHERE email = '${ this.USER_auth!.Email }' AND password = '${ this.USER_auth!.Password }'`

            return await this.DB_connection.query(query)
                .then(result => {
                    if (result.rowCount == 0)
                        throw new Error("Usuário não encontrado.")

                    return new User(result.rows[0])
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

    private async GetUserPhoto(userId : number) : Promise<string | null> {
        try
        {
            const userPhoto = await UserBase.GetPhoto(this.DB_connection, userId)

            return IsUndNull(userPhoto)
                ? null
                : userPhoto!.PhotoBase64
        }
        catch
        {
            return null
        }
    }
}

export default LoginService