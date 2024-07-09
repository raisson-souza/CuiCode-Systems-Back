import Env from "../../config/Env"
import DB from "../../classes/db/DB"

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
        Db.ConnectPostgres()
        // TODO: implementar conexão do sqlite e firebase para testes

        // TESTES UNITÁRIOS...
        //
    }
    catch (ex)
    {
        console.log(`ERRO NO TESTE:\n${ (ex as Error).message }`)
    }
}

export default Test