import { Express } from "express"

import DatabaseService from "../services/system/DatabaseService"

import ValidateCorsAsync from "../functions/system/ValidateCorsAsync"

function SystemController(app : Express)
{
    app.route('/database')
        .get((req, res) => {
            ValidateCorsAsync(req, res)
                .then(async () => {
                    await new DatabaseService(req, res).Operation()
                }).catch(() => {})
        })
        .post((req, res) => {
            ValidateCorsAsync(req, res)
                .then(async () => {
                    await new DatabaseService(req, res).Operation()
                }).catch(() => {})
        })
}

export default SystemController