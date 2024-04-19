import ClientService from "../../classes/service/ClientService"
import ResponseMessage from "../../classes/system/ResponseMessage"

import HttpStatusEnum from "../../enums/system/HttpStatusEnum"
import ModulesEnum from "../../enums/ModulesEnum"

type AuthorizedModulesResponse = {
    /** Identificação do módulo */
    moduleEnum : ModulesEnum
    /** URL do módulo */
    moduleUrl : string
    /** Módulo já acessado (define novidade no frontend) */
    usedModule : boolean
    /** Nome do módulo */
    ModuleName : string
}

const defaultModules : AuthorizedModulesResponse[] = [
    {
        moduleEnum: ModulesEnum.Users,
        moduleUrl: "users",
        usedModule: true,
        ModuleName: "Usuários",
    },
    {
        moduleEnum: ModulesEnum.Groups,
        moduleUrl: "groups",
        usedModule: true,
        ModuleName: "Grupos",
    },
    {
        moduleEnum: ModulesEnum.Board,
        moduleUrl: "boards",
        usedModule: true,
        ModuleName: "Boards",
    }
]

class UserAuthorizedModulesService extends ClientService
{
    Action = "Captura de Módulos Disponíveis ao Usuário"

    CheckBody() { }

    CheckQuery() { }

    CheckParams() { }

    async Operation() {
        try
        {
            await this.AuthenticateRequestor()

            const usedMorfeus = false
            const usedHestia = false
            const usedMinerva = false
            const usedAnansi = false
            const usedZeus = false

            // O ID do enum se refere a logo de cada módulo armazenadas no front-end através do src
            const authorizedModules : AuthorizedModulesResponse[] = [
                {
                    moduleEnum: ModulesEnum.Users,
                    moduleUrl: "users",
                    usedModule: true,
                    ModuleName: "Usuários",
                },
                {
                    moduleEnum: ModulesEnum.Groups,
                    moduleUrl: "groups",
                    usedModule: true,
                    ModuleName: "Grupos",
                },
                {
                    moduleEnum: ModulesEnum.Board,
                    moduleUrl: "boards",
                    usedModule: true,
                    ModuleName: "Boards",
                },
                {
                    moduleEnum: ModulesEnum.Morfeus,
                    moduleUrl: "morfeus",
                    usedModule: usedMorfeus,
                    ModuleName: "Morfeus",
                },
                {
                    moduleEnum: ModulesEnum.Chats,
                    moduleUrl: "chats",
                    usedModule: true,
                    ModuleName: "Chats",
                },
                {
                    moduleEnum: ModulesEnum.Solicitations,
                    moduleUrl: "solicitations",
                    usedModule: true,
                    ModuleName: "Solicitações",
                },
                // {
                //     moduleEnum: ModulesEnum.Hestia,
                //     moduleUrl: "hestia",
                //     usedModule: usedHestia,
                //     ModuleName: "Héstia",
                // },
                // {
                //     moduleEnum: ModulesEnum.Minerva,
                //     moduleUrl: "minerva",
                //     usedModule: usedMinerva,
                //     ModuleName: "Minerva",
                // },
                // {
                //     moduleEnum: ModulesEnum.Donation,
                //     moduleUrl: "donations",
                //     usedModule: true,
                //     ModuleName: "Doações",
                // },
                // {
                //     moduleEnum: ModulesEnum.CuiPoints,
                //     moduleUrl: "cuipoints",
                //     usedModule: true,
                //     ModuleName: "CuiPoints",
                // },
                // {
                //     moduleEnum: ModulesEnum.Anansi,
                //     moduleUrl: "anansi",
                //     usedModule: usedAnansi,
                //     ModuleName: "Anansi",
                // },
                // {
                //     moduleEnum: ModulesEnum.Zeus,
                //     moduleUrl: "zeus",
                //     usedModule: usedZeus,
                //     ModuleName: "Zeus",
                // }
            ]

            if (this.USER_auth!.IsAdm()) {
                authorizedModules.push({
                    moduleEnum: ModulesEnum.Operational,
                    moduleUrl: "operational",
                    usedModule: true,
                    ModuleName: "Operacional",
                })
                authorizedModules.push({
                    moduleEnum: ModulesEnum.Cron,
                    moduleUrl: "cron",
                    usedModule: true,
                    ModuleName: "Cronos",
                })
            }

            ResponseMessage.Send({
                status: HttpStatusEnum.OK,
                data: authorizedModules,
                expressResponse: this.RES,
                log: this.Action
            })
        }
        catch (ex)
        {
            ResponseMessage.Send({
                status: HttpStatusEnum.INTERNAL_SERVER_ERROR,
                data: defaultModules,
                expressResponse: this.RES,
                log: this.Action,
            })
        }
        finally
        {
            this.DB_connection.end()
        }
    }
}

export default UserAuthorizedModulesService