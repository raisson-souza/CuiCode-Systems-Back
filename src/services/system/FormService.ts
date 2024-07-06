import CONFIRM_RESTORATION_FORM from "../../assets/forms/confirm_restoration.json"
import CREATE_USER_FORM from "../../assets/forms/create_user.json"
import LOGIN_FORM from "../../assets/forms/login.json"
import UPDATE_PASSWORD_FORM from "../../assets/forms/update_password.json"
import UPDATE_USER_FORM from "../../assets/forms/update_user.json"

import {
    GetProps,
    GetReturn
} from "./types/FormServiceProps"

export default abstract class FormService
{
    /** Captura um formulário. */
    static Get(props : GetProps) : GetReturn
    {
        const { formName } = props

        switch (formName)
        {
            case "create_user":
                return CREATE_USER_FORM as GetReturn
            case "login":
                return LOGIN_FORM as GetReturn
            case "update_user":
                return UPDATE_USER_FORM as GetReturn
            case "update_password":
                return UPDATE_PASSWORD_FORM as GetReturn
            case "confirm_restoration":
                return CONFIRM_RESTORATION_FORM as GetReturn
            case "create_group":
                throw new Error("Formuláro não desenvolvido.")
            case "update_group":
                throw new Error("Formuláro não desenvolvido.")
            case "update_group_members":
                throw new Error("Formuláro não desenvolvido.")
            default:
                throw new Error("Formulário não encontrado.")
        }
    }
}