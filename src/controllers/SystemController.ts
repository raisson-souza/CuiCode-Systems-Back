import { Express } from "express"

import DatabaseService from "../services/system/DatabaseService"

import Send from "../functions/Responses"
import ValidateCorsAsync from "../functions/system/ValidateCorsAsync"

export default function SystemController(
    app : Express
)
{
    app.route('/database')
        .get((req, res) => {
            Promise.resolve(ValidateCorsAsync(req, res))
                .then(async () => {
                    const service = new DatabaseService(req, res)
                    await service.CheckDatabaseStatus()
                })
                .catch(() => { Send.Error(res, "Acesso a CuiCodeSystems negado.", "Acesso a API") })
        })
        .post((req, res) => {
            Promise.resolve(ValidateCorsAsync(req, res))
                .then(async () => {
                    const service = new DatabaseService(req, res)
                    await service.CheckDatabaseStatus()
                })
                .catch(() => { Send.Error(res, "Acesso a CuiCodeSystems negado.", "Acesso a API") })
        })
}