import ClientService from "../../classes/service/ClientService"
import ResponseMessage from "../../classes/system/ResponseMessage"

import HttpStatusEnum from "../../enums/system/HttpStatusEnum"
import ModulesEnum from "../../enums/ModulesEnum"

type AuthorizedModulesResponse = {
    moduleEnum : ModulesEnum
    moduleUrl : string
    usedModule : boolean
}

const defaultModules = [
    {
        moduleEnum: ModulesEnum.Users,
        moduleUrl: "/users",
        usedModule: true
    },
    {
        moduleEnum: ModulesEnum.Groups,
        moduleUrl: "/groups",
        usedModule: true
    },
    {
        moduleEnum: ModulesEnum.Board,
        moduleUrl: "/boards",
        usedModule: true
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
                    moduleUrl: "/users",
                    usedModule: true
                },
                {
                    moduleEnum: ModulesEnum.Groups,
                    moduleUrl: "/groups",
                    usedModule: true
                },
                {
                    moduleEnum: ModulesEnum.Board,
                    moduleUrl: "/boards",
                    usedModule: true
                },
                {
                    moduleEnum: ModulesEnum.Morfeus,
                    moduleUrl: "/morfeus",
                    usedModule: usedMorfeus
                },
                {
                    moduleEnum: ModulesEnum.Chats,
                    moduleUrl: "/chats",
                    usedModule: true
                },
                {
                    moduleEnum: ModulesEnum.Solicitations,
                    moduleUrl: "/solicitations",
                    usedModule: true
                },
                // {
                //     moduleEnum: ModulesEnum.Hestia,
                //     moduleUrl: "/hestia",
                //     usedModule: usedHestia
                // },
                // {
                //     moduleEnum: ModulesEnum.Minerva,
                //     moduleUrl: "/minerva",
                //     usedModule: usedMinerva
                // },
                // {
                //     moduleEnum: ModulesEnum.Donation,
                //     moduleUrl: "/donations",
                //     usedModule: true
                // },
                // {
                //     moduleEnum: ModulesEnum.CuiPoints,
                //     moduleUrl: "/cuipoints",
                //     usedModule: true
                // },
                // {
                //     moduleEnum: ModulesEnum.Anansi,
                //     moduleUrl: "/anansi",
                //     usedModule: usedAnansi
                // },
                // {
                //     moduleEnum: ModulesEnum.Zeus,
                //     moduleUrl: "/zeus",
                //     usedModule: usedZeus
                // }
            ]

            if (this.USER_auth!.IsAdm()) {
                authorizedModules.push({
                    moduleEnum: ModulesEnum.Operational,
                    moduleUrl: "/operational",
                    usedModule: true
                })
                authorizedModules.push({
                    moduleEnum: ModulesEnum.Cron,
                    moduleUrl: "/cron",
                    usedModule: true
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
    }
}

export default UserAuthorizedModulesService