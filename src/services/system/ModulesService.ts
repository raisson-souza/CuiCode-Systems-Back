import Module from "../../classes/entities/system/Module"
import SqlFormatter from "../../classes/sql/SqlFormatter"

import ModulesEnum from "../../enums/ModulesEnum"

import {
    ActivateModuleProps,
    DeactivateModuleProps,
    IncludeUserInModuleProps,
    IsModuleActiveProps,
    ModulesServiceProps
} from "./types/ModulesServiceProps"

export default abstract class ModulesService
{
    /** Captura os módulos do sistema. */
    static async List(props : ModulesServiceProps) : Promise<Module[]>
    {
        const query = "SELECT * FROM modules"
        return await props.Db.PostgresDb.query(query)
            .then(result => {
                const modules : Module[] = []

                result.rows.map(module => {
                    modules.push(new Module(module))
                })

                return modules
            })
    }

    /** Verifica se um módulo específico está ativo. */
    static IsModuleActive = {
        Board : async (props : IsModuleActiveProps) => {
            return this._isModuleActive({ Db: props.Db, module: ModulesEnum.Board })
        },
        Morfeus : async (props : IsModuleActiveProps) => {
            return this._isModuleActive({ Db: props.Db, module: ModulesEnum.Morfeus })
        },
        Chats : async (props : IsModuleActiveProps) => {
            return this._isModuleActive({ Db: props.Db, module: ModulesEnum.Chats })
        },
        Solicitations : async (props : IsModuleActiveProps) => {
            return this._isModuleActive({ Db: props.Db, module: ModulesEnum.Solicitations })
        },
        Cron : async (props : IsModuleActiveProps) => {
            return this._isModuleActive({ Db: props.Db, module: ModulesEnum.Cron })
        },
        Hestia : async (props : IsModuleActiveProps) => {
            return this._isModuleActive({ Db: props.Db, module: ModulesEnum.Hestia })
        },
        Minerva : async (props : IsModuleActiveProps) => {
            return this._isModuleActive({ Db: props.Db, module: ModulesEnum.Minerva })
        },
        Donation : async (props : IsModuleActiveProps) => {
            return this._isModuleActive({ Db: props.Db, module: ModulesEnum.Donation })
        },
    }

    private static async _isModuleActive(props : IsModuleActiveProps) : Promise<boolean>
    {
        const query = `SELECT * FROM modules WHERE id = ${ props.module }`

        return await props.Db.PostgresDb.query(query)
            .then(result => {
                return new Module(result.rows[0]).Active
            })
            .catch(ex => { throw new Error(ex.message) })
    }

    /** Ativa um módulo do sistema. */
    static async ActivateModule(props : ActivateModuleProps)
    {
        const query = `UPDATE modules SET active = true WHERE module = '${ props.moduleName }'`
        SqlFormatter.SqlInjectionVerifier([props.moduleName])
        await props.Db.PostgresDb.query(query)
            .then(() => { })
            .catch(ex => { throw new Error(ex.message) })
    }

    /** Desativa um módulo do sistema. */
    static async DeactivateModule(props : DeactivateModuleProps)
    {
        const query = `UPDATE modules SET active = false WHERE module = '${ props.moduleName }'`
        SqlFormatter.SqlInjectionVerifier([props.moduleName])
        await props.Db.PostgresDb.query(query)
            .then(() => { })
            .catch(ex => { throw new Error(ex.message) })
    }

    /** Inclui um usuário em um módulo. */
    static async IncludeUserInModule(props : IncludeUserInModuleProps)
    {

    }
}