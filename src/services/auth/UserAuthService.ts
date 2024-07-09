import AuthService from "./AuthService"
import User from "../../classes/entities/user/User"
import UsersService from "../users/UsersService"

import EncryptInfo from "../../functions/security/EncryptPassword"
import IsNil from "../../functions/logic/IsNil"

import {
    LoginProps,
    LoginReturn,
    UserAuthorizedModulesProps,
    UserAuthorizedModulesReturn
} from "./types/AuthServiceProps"

import ModulesEnum from "../../enums/ModulesEnum"

export default abstract class UserAuthService
{
    /** Realiza o login. */
    static async Login(props : LoginProps) : Promise<LoginReturn>
    {
        const { userEmail, userPassword } = props

        const encryptedPassword = EncryptInfo(userPassword)

        let query = `SELECT * FROM users WHERE email = '${ userEmail }' AND password = '${ encryptedPassword }'`

        const userDb = await props.Db.PostgresDb.query(query)
            .then(result => {
                if (result.rowCount === 0)
                    throw new Error("Esta conta não existe.")
                return new User(result.rows[0])
            })
            .catch(ex => { throw new Error(ex) })

        const userPhoto = await UsersService.GetPhoto({
            Db: props.Db,
            userId: userDb.Id
        })

        if (!IsNil(userPhoto))
            userDb.Photo = userPhoto!

        const token = AuthService.CreateLoginToken({
            userAuthId: userDb.Id
        })

        return {
            token: token,
            user: userDb
        }
    }

    /** Captura a lista de módulos autorizados ao usuário. */
    static async UserAuthorizedModules(props : UserAuthorizedModulesProps) : Promise<UserAuthorizedModulesReturn[]>
    {
        const usedMorfeus = false
        const usedHestia = false
        const usedMinerva = false
        const usedAnansi = false
        const usedZeus = false

        // O ID do enum se refere a logo de cada módulo armazenadas no front-end através do src
        const authorizedModules : UserAuthorizedModulesReturn[] = [
            {
                moduleEnum: ModulesEnum.Users,
                moduleUrl: "users",
                usedModule: true,
                moduleName: "Usuários",
                activeModule: true
            },
            // {
            //     moduleEnum: ModulesEnum.Groups,
            //     moduleUrl: "groups",
            //     usedModule: true,
            //     moduleName: "Grupos",
            //     activeModule: true
            // },
            // {
            //     moduleEnum: ModulesEnum.Board,
            //     moduleUrl: "boards",
            //     usedModule: true,
            //     moduleName: "Boards",
            //     activeModule: true
            // },
            {
                moduleEnum: ModulesEnum.Morfeus,
                moduleUrl: "morfeus",
                usedModule: usedMorfeus,
                moduleName: "Morfeus",
                activeModule: true
            },
            // {
            //     moduleEnum: ModulesEnum.Chats,
            //     moduleUrl: "chats",
            //     usedModule: true,
            //     moduleName: "Chats",
            //     activeModule: true
            // },
            // {
            //     moduleEnum: ModulesEnum.Solicitations,
            //     moduleUrl: "solicitations",
            //     usedModule: true,
            //     moduleName: "Solicitações",
            //     activeModule: true
            // },
            // {
            //     moduleEnum: ModulesEnum.Hestia,
            //     moduleUrl: "hestia",
            //     usedModule: usedHestia,
            //     moduleName: "Héstia",
            //     activeModule: true
            // },
            // {
            //     moduleEnum: ModulesEnum.Minerva,
            //     moduleUrl: "minerva",
            //     usedModule: usedMinerva,
            //     moduleName: "Minerva",
            //     activeModule: true
            // },
            // {
            //     moduleEnum: ModulesEnum.Donation,
            //     moduleUrl: "donations",
            //     usedModule: true,
            //     moduleName: "Doações",
            //     activeModule: true
            // },
            // {
            //     moduleEnum: ModulesEnum.CuiPoints,
            //     moduleUrl: "cuipoints",
            //     usedModule: true,
            //     moduleName: "CuiPoints",
            //     activeModule: true
            // },
            // {
            //     moduleEnum: ModulesEnum.Anansi,
            //     moduleUrl: "anansi",
            //     usedModule: usedAnansi,
            //     moduleName: "Anansi",
            //     activeModule: true
            // },
            // {
            //     moduleEnum: ModulesEnum.Zeus,
            //     moduleUrl: "zeus",
            //     usedModule: usedZeus,
            //     moduleName: "Zeus",
            //     activeModule: true
            // }
        ]

        if (props.user.IsAdm()) {
            authorizedModules.push({
                moduleEnum: ModulesEnum.Operational,
                moduleUrl: "operational",
                usedModule: true,
                moduleName: "Operacional",
                activeModule: true
            })
            authorizedModules.push({
                moduleEnum: ModulesEnum.Cron,
                moduleUrl: "cron",
                usedModule: true,
                moduleName: "Cronos",
                activeModule: true
            })
        }

        return authorizedModules
    }
}