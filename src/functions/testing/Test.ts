import DB from "../../classes/db/DB"
import Env from "../../config/Env"

/**
 * Função para testes unitários do backend.
 */
async function Test() : Promise<void>
{
    try
    {
        // Pula a função caso não seja ambiente de desenvolvimento
        if (!Env.IsDevelopment())
            return

        // Conexão de teste para o banco
        const Db = new DB()
        await Db.ConnectPostgres()
        await Db.ConnectSqlite()

        // TESTES UNITÁRIOS...
        //

        // Fechamento da conexão
        await Db.DisconnectPostgres()
        await Db.DisconnectSqlite()
    }
    catch (ex)
    {
        console.log(`ERRO NO TESTE:\n${ (ex as Error).message }`)
    }
}

export default Test