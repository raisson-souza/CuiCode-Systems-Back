import QueryUser from "../../services/user/utilities/QueryUser"

import Service from "./base/Service"

import ResponseMessage from "../system/ResponseMessage"
import UserAuth from "../entities/user/UserAuth"
import UserRepository from "../entities/user/UserRepository"

import IsUndNull from "../../functions/IsUndNull"
import PermissionLevelToNumber from "../../functions/enums/PermissionLevelToNumber"

import HttpStatusEnum from "../../enums/system/HttpStatusEnum"
import PermissionLevelEnum from "../../enums/PermissionLevelEnum"

abstract class ClientService extends Service
{
    SameUserAuthAndUserToOperate : boolean

    abstract Operation() : void

    /**
     * Realiza a autenticação do usuário.
     * É necessário ser chamado em fluxos que exigem autenticação.
     */
    async AuthenticateRequestor()
    {
        const userAuthId = this.CheckUserAuthId()

        const user = await Promise.resolve(
            QueryUser(this.DB_connection, userAuthId))
                .then(user => {
                    return new UserAuth(user, this.REQ.headers)
                })
                .catch(ex => {
                    if ((ex as Error).message === "Nenhum usuário encontrado.")
                    {
                        ResponseMessage.Send(
                            HttpStatusEnum.NOT_FOUND,
                            "Usuário requeridor não encontrado.",
                            this.Action,
                            this.RES
                        )
                        throw new Error("Usuário requeridor não encontrado.")
                    }

                    throw new Error((ex as Error).message)
                })

        UserRepository.ValidateUserValidity(user)

        this.USER_auth = user
    }

    /**
     * Realiza a validação do usuário autenticado.
     */
    ValidateRequestor
    (
        level : PermissionLevelEnum = PermissionLevelEnum.Member,
        userIdToOperate : number | null = null,
        allowDifferentUserAuthAndUserToOperate : boolean = false
    )
    {
        UserRepository.ValidateUserPermission(this.USER_auth!, level)

        if (!IsUndNull(userIdToOperate))
        {
            if (this.USER_auth!.Id != userIdToOperate)
            {
                this.SameUserAuthAndUserToOperate = false
                if
                (
                    allowDifferentUserAuthAndUserToOperate ||
                    this.USER_auth!.PermissionLevel!.Value! >= PermissionLevelToNumber(PermissionLevelEnum.Adm)
                )
                    return
                ResponseMessage.ProhibitedOperation(this.RES, this.Action)
                throw new Error("Usuário não autorizado para tal ação.")
            }
            this.SameUserAuthAndUserToOperate = true
        }
    }

    private CheckUserAuthId() : number
    {
        const userAuthId = this.GetAuthentications().UserAuthId

        if (IsUndNull(userAuthId))
        {
            ResponseMessage.Send(
                HttpStatusEnum.NOT_FOUND,
                "Usuário requeridor não encontrado.",
                this.Action,
                this.RES
            )
            throw new Error("Usuário requeridor não encontrado na requisição.")
        }

        return Number.parseInt(userAuthId!)
    }
}

export default ClientService