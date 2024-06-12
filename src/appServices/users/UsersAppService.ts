import AppServiceBase from "../base/AppServiceBase"
import ResponseMessage from "../../classes/system/ResponseMessage"
import User from "../../classes/entities/user/User"
import UsersAccountService from "../../services/users/UsersAccountService"
import UsersService from "../../services/users/UsersService"

import IUsersAppService from "./IUsersAppService"

import { UpdateUserDTO } from "./base/types/UsersAppServiceProps"

import HttpStatusEnum from "../../enums/system/HttpStatusEnum"
import PermissionLevelEnum from "../../enums/PermissionLevelEnum"

import IsNil from "../../functions/logic/IsNil"
import ToBool from "../../functions/formatting/ToBool"

export default class UsersAppService extends AppServiceBase implements IUsersAppService
{
    AppServiceAction = "AppService Usuários"

    async CreateUser()
    {
        try
        {
            const user = new User(this.REQ.body)

            await this.Db.ConnectPostgres()

            await UsersService.Create({
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

    async UpdateUser()
    {
        try
        {
            const userDto : UpdateUserDTO = {
                Id: Number.parseInt(this.REQ.body["Id"]),
                Active: ToBool(this.REQ.body["Active"]),
                Deleted: ToBool(this.REQ.body["Deleted"]),
                BirthDate: this.REQ.body["BirthDate"],
                Email: this.REQ.body["Email"],
                Name: this.REQ.body["Name"],
                PermissionLevel: Number.parseInt(this.REQ.body["PermissionLevel"]),
                Phone: this.REQ.body["Phone"],
                PhotoBase64: this.REQ.body["PhotoBase64"],
                RecoveryEmail: this.REQ.body["RecoveryEmail"],
                Sex: Number.parseInt(this.REQ.body["Sex"]),
                Username: this.REQ.body["Username"],
            }

            await this.Db.ConnectPostgres()

            await this.AuthenticateUserRequestor()

            this.ValidateUserRequestor({
                allowDifferentUserAuthAndUserToOperate: true,
                level: PermissionLevelEnum.Member,
                userIdToOperate: userDto.Id
            })

            const newUser = await UsersService.Update({
                Db: this.Db,
                user: userDto,
                updatedBy: this.UserAuth!.Id,
                authUser: this.UserAuth!,
            })

            ResponseMessage.Send({
                status: HttpStatusEnum.ACCEPTED,
                data: `Usuário ${ newUser.GenerateUserKey() } editado com sucesso.`,
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

    InactivateUser()
    {
        throw new Error("Method not implemented.");
    }

    async GetUser()
    {
        const ACTION = `${ this.AppServiceAction } / Captura de usuário`
        try
        {
            const userId = Number.parseInt(this.REQ.query.id as string)

            if (IsNil(userId))
            {
                ResponseMessage.SendNullField({
                    expressResponse: this.RES,
                    fields: ["id"],
                    log: ACTION
                })
            }

            await this.Db.ConnectPostgres()

            const user = await UsersService.Get({
                Db: this.Db,
                userId: userId
            })

            ResponseMessage.Send({
                expressResponse: this.RES,
                data: user,
                status: HttpStatusEnum.OK,
                log: ACTION
            })
        }
        catch (ex)
        {
            ResponseMessage.Send({
                expressResponse: this.RES,
                data: (ex as Error).message,
                status: HttpStatusEnum.INTERNAL_SERVER_ERROR,
                log: ACTION
            })
        }
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