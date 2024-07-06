import { sign, verify } from "jsonwebtoken"
import Env from "../../config/Env"

import UsersService from "../users/UsersService"

import {
    CreateLoginTokenProps,
    ValidateJwtProps,
    ValidateJwtReturn,
} from "./types/AuthServiceProps"

import UsersVisualizationEnum from "../../enums/modules/UsersVisualizationEnum"

export default abstract class AuthService
{
    /** Realiza a validação de um token JWT. */
    static async ValidateJwt(props : ValidateJwtProps) : Promise<ValidateJwtReturn>
    {
        const { token } = props

        const decoded = verify(token, Env.JwtSecret()) as any
        const userId = Number.parseInt(decoded["UserAuthId"])

        const user = await UsersService.Get({
            Db: props.Db,
            userId: userId,
            visualizationEnum: UsersVisualizationEnum.All
        })

        const newToken = this.CreateLoginToken({
            userAuthId: userId
        })

        return {
            newToken: newToken,
            user: user
        }
    }

    /** Cria token para login. */
    static CreateLoginToken(props : CreateLoginTokenProps) : string
    {
        return sign(
            { "UserAuthId": props.userAuthId },
            Env.JwtSecret(),
            { expiresIn: "3d" }
        )
    }

    /** Cria token do sistema. */
    static CreateSystemToken()
    { }
}
