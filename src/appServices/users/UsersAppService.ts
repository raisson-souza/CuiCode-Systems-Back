import AppServiceBase from "../base/AppServiceBase"
import ResponseMessage from "../../classes/system/ResponseMessage"
import User from "../../classes/entities/user/User"
import UsersAccountService from "../../services/users/UsersAccountService"
import UsersService from "../../services/users/UsersService"

import IUsersAppService from "./IUsersAppService"

import { UpdateUserDTO } from "./base/types/UsersAppServiceProps"

import PermissionLevelEnum from "../../enums/PermissionLevelEnum"
import UsersVisualizationEnum from "../../enums/modules/UsersVisualizationEnum"

import IsNil from "../../functions/logic/IsNil"
import ToBool from "../../functions/formatting/ToBool"
import UsersFilterEnumParser from "../../functions/enums/UsersFilterEnumParser"
import UsersVisualizationEnumParser from "../../functions/enums/UsersVisualizationEnumParser"

export default class UsersAppService extends AppServiceBase implements IUsersAppService
{
    AppServiceAction = "Usuários"

    async CreateUser()
    {
        const ACTION = `${ this.AppServiceAction } / Criação de usuário`
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

            await ResponseMessage.Success({
                responseData: `Usuário ${ user.GenerateUserKey() } criado com sucesso.`,
                responseLog: ACTION,
                expressResponse: this.RES
            })

            await this.Db.DisconnectPostgres()
        }
        catch (ex)
        {
            await ResponseMessage.InternalServerError({
                responseData: (ex as Error).message,
                responseLog: ACTION,
                expressResponse: this.RES
            })
        }
    }

    async UpdateUser()
    {
        const ACTION = `${ this.AppServiceAction } / Edição de usuário`
        try
        {
            const userDto : UpdateUserDTO = {
                Id: Number.parseInt(this.GetReqBodyValue("Id") ?? ""),
                Active: ToBool(this.GetReqBodyValue("Active")),
                Deleted: ToBool(this.GetReqBodyValue("Deleted")),
                BirthDate: this.GetReqBodyValue("BirthDate") ?? "",
                Email: this.GetReqBodyValue("Email") ?? "",
                Name: this.GetReqBodyValue("Name") ?? "",
                PermissionLevel: Number.parseInt(this.GetReqBodyValue("PermissionLevel") ?? ""),
                Phone: this.GetReqBodyValue("Phone") ?? "",
                PhotoBase64: this.GetReqBodyValue("PhotoBase64") ?? "",
                RecoveryEmail: this.GetReqBodyValue("RecoveryEmail") ?? "",
                Sex: Number.parseInt(this.GetReqBodyValue("Sex") ?? ""),
                Username: this.GetReqBodyValue("Username") ?? "",
            }

            await this.Db.ConnectPostgres()
            await this.AuthenticateUserRequestor()
            await this.ValidateUserRequestor({})

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

            await ResponseMessage.Success({
                responseData: `Usuário ${ newUser.GenerateUserKey() } editado com sucesso.`,
                responseLog: ACTION,
                expressResponse: this.RES
            })

            await this.Db.DisconnectPostgres()
        }
        catch (ex)
        {
            await ResponseMessage.InternalServerError({
                responseData: (ex as Error).message,
                responseLog: ACTION,
                expressResponse: this.RES
            })
        }
    }

    async InactivateUser()
    {
        const ACTION = `${ this.AppServiceAction } /`
        try
        {
            await this.Db.ConnectPostgres()

            // await this.AuthenticateUserRequestor()
            // this.AuthenticateSystemRequestor()

            // this.ValidateUserRequestor({
            //     userIdToOperate: 1,
            // })

            await ResponseMessage.Success({
                responseData: null,
                responseLog: ACTION,
                expressResponse: this.RES
            })

            await this.Db.DisconnectPostgres()
        }
        catch (ex)
        {
            await ResponseMessage.InternalServerError({
                responseData: (ex as Error).message,
                responseLog: ACTION,
                expressResponse: this.RES
            })
        }
    }

    async GetUser()
    {
        const ACTION = `${ this.AppServiceAction } / Captura de usuário`
        try
        {
            const userId = Number.parseInt(this.REQ.query.id as string)

            if (IsNil(userId))
            {
                await ResponseMessage.SendNullField({
                    expressResponse: this.RES,
                    fields: ["id"],
                    responseLog: ACTION
                })
            }

            await this.Db.ConnectPostgres()
            await this.AuthenticateUserRequestor()
            await this.ValidateUserRequestor({})

            const user = await UsersService.Get({
                Db: this.Db,
                userId: userId,
                visualizationEnum: UsersVisualizationEnum.All
            })

            await ResponseMessage.Success({
                responseData: user,
                responseLog: ACTION,
                expressResponse: this.RES
            })

            await this.Db.DisconnectPostgres()
        }
        catch (ex)
        {
            await ResponseMessage.InternalServerError({
                responseData: (ex as Error).message,
                responseLog: ACTION,
                expressResponse: this.RES
            })
        }
    }

    async GetUserPhoto()
    {
        const ACTION = `${ this.AppServiceAction } / Captura de foto de usuário`
        try
        {
            const userId = Number.parseInt(this.GetReqParamValue("id") ?? "")

            if (IsNil(userId))
            {
                await ResponseMessage.SendNullField({
                    expressResponse: this.RES,
                    fields: ["id"],
                    responseLog: ACTION
                })
            }

            await this.Db.ConnectPostgres()
            await this.AuthenticateUserRequestor()
            await this.ValidateUserRequestor({})

            const photo = await UsersService.GetPhoto({
                Db: this.Db,
                userId: userId
            })

            await ResponseMessage.Success({
                responseData: photo,
                responseLog: ACTION,
                expressResponse: this.RES
            })

            await this.Db.DisconnectPostgres()
        }
        catch (ex)
        {
            await ResponseMessage.InternalServerError({
                responseData: (ex as Error).message,
                responseLog: ACTION,
                expressResponse: this.RES
            })
        }
    }

    async RegistryUserPhoto()
    {
        const ACTION = `${ this.AppServiceAction } / Cadastro de foto de usuário`
        try
        {
            const userId = Number.parseInt(this.GetReqParamValue("id") ?? "")
            const photo = this.GetReqBodyValue("photo")

            if (IsNil(userId) || IsNil(photo))
            {
                await ResponseMessage.SendNullField({
                    expressResponse: this.RES,
                    fields: ["id", "photo"],
                    responseLog: ACTION
                })
            }

            await this.Db.ConnectPostgres()
            await this.AuthenticateUserRequestor()
            await this.ValidateUserRequestor({
                userIdToOperate: userId,
            })

            await UsersService.RegistryPhoto({
                Db: this.Db,
                photo: photo!,
                userId: userId
            })

            await ResponseMessage.Success({
                responseData: photo,
                responseLog: ACTION,
                expressResponse: this.RES
            })

            await this.Db.DisconnectPostgres()
        }
        catch (ex)
        {
            await ResponseMessage.InternalServerError({
                responseData: (ex as Error).message,
                responseLog: ACTION,
                expressResponse: this.RES
            })
        }
    }

    async ListUsers()
    {
        const ACTION = `${ this.AppServiceAction } / Listagem de usuários`
        try
        {
            await this.AuthenticateSystemRequestor()

            const visualizationEnum = UsersVisualizationEnumParser(Number.parseInt(this.REQ.query["visualization"] as string))
            const filterEnum = UsersFilterEnumParser(Number.parseInt(this.REQ.query["filter"] as string))
            const limit = Number.parseInt(this.REQ.query["limit"] as string)

            if (IsNil(visualizationEnum) || IsNil(filterEnum) || IsNil(limit))
            {
                await ResponseMessage.SendNullField({
                    expressResponse: this.RES,
                    fields: ["visualization", "filter", "limit"],
                    responseLog: ACTION
                })
            }

            await this.Db.ConnectPostgres()

            const dataPagination = await UsersService.List({
                Db: this.Db,
                filterEnum: filterEnum,
                visualizationEnum: visualizationEnum,
                pagination: {
                    limit: limit
                }
            })

            await ResponseMessage.Success({
                responseData: dataPagination,
                responseLog: ACTION,
                expressResponse: this.RES,
                responseDataPropToCount: "responseData"
            })

            await this.Db.DisconnectPostgres()
        }
        catch (ex)
        {
            await ResponseMessage.InternalServerError({
                responseData: (ex as Error).message,
                responseLog: ACTION,
                expressResponse: this.RES
            })
        }
    }

    async DailyInfo()
    {
        const ACTION = `${ this.AppServiceAction } / Informações Diárias do Usuário`
        try
        {
            await this.Db.ConnectPostgres()
            await this.AuthenticateUserRequestor()
            this.ValidateUserRequestor({})

            const dailyInfo = await UsersService.DailyInfo({
                Db: this.Db,
                userId: this.UserAuth!.Id,
            })

            await ResponseMessage.Success({
                responseData: dailyInfo,
                responseLog: ACTION,
                expressResponse: this.RES
            })

            await this.Db.DisconnectPostgres()
        }
        catch (ex)
        {
            await ResponseMessage.InternalServerError({
                responseData: (ex as Error).message,
                responseLog: ACTION,
                expressResponse: this.RES
            })
        }
    }

    async GetUserLogs()
    {
        const ACTION = `${ this.AppServiceAction } / Logs de usuário`
        try
        {
            const userId = Number.parseInt(this.GetReqParamValue("id") ?? "")
            const initialDate = new Date(this.REQ.query.initialDate as string)
            const finalDate = new Date(this.REQ.query.finalDate as string)

            if (IsNil(userId))
            {
                await ResponseMessage.SendNullField({
                    expressResponse: this.RES,
                    fields: ["id"],
                    responseLog: ACTION
                })
            }

            await this.Db.ConnectPostgres()
            await this.AuthenticateUserRequestor()
            await this.ValidateUserRequestor({})

            const userLogs = await UsersService.GetLogs({
                Db: this.Db,
                userId: userId,
                initialDate: !isNaN(initialDate.getTime()) ? initialDate : undefined,
                finalDate: !isNaN(finalDate.getTime()) ? finalDate : undefined
            })

            await ResponseMessage.Success({
                responseData: userLogs,
                responseLog: ACTION,
                expressResponse: this.RES
            })

            await this.Db.DisconnectPostgres()
        }
        catch (ex)
        {
            await ResponseMessage.InternalServerError({
                responseData: (ex as Error).message,
                responseLog: ACTION,
                expressResponse: this.RES
            })
        }
    }

    async UpdatePassword()
    {
        const ACTION = `${ this.AppServiceAction } /`
        try
        {
            await this.Db.ConnectPostgres()

            // await this.AuthenticateUserRequestor()
            // this.AuthenticateSystemRequestor()

            // this.ValidateUserRequestor({
            //     userIdToOperate: 1,
            // })

            await ResponseMessage.Success({
                responseData: null,
                responseLog: ACTION,
                expressResponse: this.RES
            })

            await this.Db.DisconnectPostgres()
        }
        catch (ex)
        {
            await ResponseMessage.InternalServerError({
                responseData: (ex as Error).message,
                responseLog: ACTION,
                expressResponse: this.RES
            })
        }
    }

    async FindEmail()
    {
        const ACTION = `${ this.AppServiceAction } / Busca de email de usuário`
        try
        {
            await this.AuthenticateSystemRequestor()

            const email = this.REQ.query["email"] as string

            if (IsNil(email))
            {
                await ResponseMessage.SendNullField({
                    expressResponse: this.RES,
                    fields: ["email"],
                    responseLog: ACTION
                })
            }

            await this.Db.ConnectPostgres()

            const foundEmail = await UsersService.FindEmail({
                Db: this.Db,
                email: email
            })

            await ResponseMessage.Success({
                responseData: foundEmail,
                responseLog: ACTION,
                expressResponse: this.RES
            })

            await this.Db.DisconnectPostgres()
        }
        catch (ex)
        {
            await ResponseMessage.InternalServerError({
                responseData: (ex as Error).message,
                responseLog: ACTION,
                expressResponse: this.RES
            })
        }
    }
}