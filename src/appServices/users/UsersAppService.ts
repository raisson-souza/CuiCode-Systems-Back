import AppServiceBase from "../base/AppServiceBase"
import ResponseMessage from "../../classes/system/ResponseMessage"
import User from "../../classes/entities/user/User"
import UsersAccountService from "../../services/users/UsersAccountService"
import UsersService from "../../services/users/UsersService"

import IUsersAppService from "./IUsersAppService"

import HttpStatusEnum from "../../enums/system/HttpStatusEnum"

export default class UsersAppService extends AppServiceBase implements IUsersAppService
{
    AppServiceAction = "Criação de usuário"

    async CreateUser()
    {
        try
        {
            const user = new User(this.REQ.body)

            await this.Db.ConnectPostgres()

            await UsersService.CreateUser({
                Db: this.Db,
                user: user
            })

            await UsersAccountService.SendEmailApproval({
                Db: this.Db,
                isCreation: true,
                user: user
            })

            ResponseMessage.Send({
                status: HttpStatusEnum.CREATED,
                data: `Usuário ${ user.GenerateUserKey() } criado com sucesso.`,
                log: this.AppServiceAction,
                expressResponse: this.RES
            })
        }
        catch (ex)
        {
            ResponseMessage.Send({
                status: HttpStatusEnum.INTERNAL_SERVER_ERROR,
                data: (ex as Error).message,
                log: this.AppServiceAction,
                expressResponse: this.RES
            })
        }
        finally
        {
            await this.Db.DisconnectPostgres()
        }
    }

    UpdateUser()
    {
        throw new Error("Method not implemented.");
    }

    InactivateUser()
    {
        throw new Error("Method not implemented.");
    }

    GetUser()
    {
        throw new Error("Method not implemented.");
    }

    GetUserPhoto()
    {
        throw new Error("Method not implemented.");
    }

    RegistryUserPhoto()
    {
        throw new Error("Method not implemented.");
    }

    ListUsers()
    {
        throw new Error("Method not implemented.");
    }

    AdvancedUsersList()
    {
        throw new Error("Method not implemented.");
    }

    DailyInfo()
    {
        throw new Error("Method not implemented.");
    }

    GetUserLogs()
    {
        throw new Error("Method not implemented.");
    }

    UpdatePassword()
    {
        throw new Error("Method not implemented.");
    }

    AccountRecovery()
    {
        throw new Error("Method not implemented.");
    }

    ConfirmAccountRecovery()
    {
        throw new Error("Method not implemented.");
    }

    VerifyEmail()
    {
        throw new Error("Method not implemented.");
    }

    ApproveUserEmail()
    {
        throw new Error("Method not implemented.");
    }

    SendManualEmailApproval()
    {
        throw new Error("Method not implemented.");
    }
}