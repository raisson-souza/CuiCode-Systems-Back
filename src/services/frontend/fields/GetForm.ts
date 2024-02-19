import CREATE_USER_FORM from "../../../assets/fields/create_user.json"
import Env from "../../../config/environment"
import UPDATE_USER_FORM from "../../../assets/fields/update_user.json"
import UPDATE_USER_PASSWORD_FORM from "../../../assets/fields/update_password.json"

import Exception from "../../../classes/custom/Exception"
import ResponseMessage from "../../../classes/system/ResponseMessage"
import ServerService from "../../../classes/service/ServerService"

import IsUndNull from "../../../functions/logic/IsUndNull"

import HttpStatusEnum from "../../../enums/system/HttpStatusEnum"

/**
 * Captura formulários para o front end.
 */
class GetForm extends ServerService
{
    Action = "Formulários FrontEnd."

    CheckBody() { }

    CheckQuery() { }

    CheckParams()
    {
        const formName = this.REQ.params["form"]

        if (IsUndNull(formName))
            ResponseMessage.SendNullField(["form"], this.Action, this.RES)

        return formName
    }

    Operation()
    {
        try
        {
            const formName = this.CheckParams()
            let form : any = null

            switch (formName)
            {
                case "create_user":
                    form = CREATE_USER_FORM
                    break
                case "update_user":
                    form = UPDATE_USER_FORM
                    break
                case "update_password":
                    form = UPDATE_USER_PASSWORD_FORM
                    break
                case "confirm_restoration":
                    break
                case "create_group":
                    break
                case "update_group":
                    break
                case "update_group_members":
                    break
                case "create_solicitation":
                    break
                case "update_solicitation":
                    break
                case "create_dream":
                    break
                case "update_dream":
                    break
                case "create_post":
                    break
                case "update_post":
                    break
                default:
                    break
            }

            if (IsUndNull(form))
            {
                const msg = "Formulário requerido não encontrado."
                ResponseMessage.Send(
                    HttpStatusEnum.INVALID,
                    msg,
                    this.Action,
                    this.RES
                )
                Exception.Error(msg, this.Action)
            }

            form.Endpoint = `${ Env.Base }${ form.Endpoint }`

            ResponseMessage.Send(
                HttpStatusEnum.OK,
                form,
                this.Action,
                this.RES
            )
        }
        catch (ex)
        {
            ResponseMessage.Send(
                HttpStatusEnum.INTERNAL_SERVER_ERROR,
                `Houve um erro ao carregar o form. Erro: ${ (ex as Error).message }`,
                this.Action,
                this.RES
            )
            Exception.UnexpectedError((ex as Error).message, this.Action)
        }
        finally
        {
            this.DB_connection.end()
        }
    }

}

export default GetForm