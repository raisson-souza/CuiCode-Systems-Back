let env = "testing"

const allowed_origins = env === "production"
    ?
        [
            "http://26.219.172.71:3000/", // ALTERAR PARA NOVO DOMINIO EM PRODUÇÃO
            "http://26.219.172.71:3000" // ALTERAR PARA NOVO DOMINIO EM PRODUÇÃO
        ]
    :
        [
        "http://localhost:3000/",
        "http://localhost:3000",
        "http://127.0.0.1:5000/",
        "http://127.0.0.1:5000",
        "http://localhost:3001/", // DOMINIO TESTING FRONT ATUAL (PORIVSÓRIO)
        "http://localhost:3001", // DOMINIO TESTING FRONT ATUAL (PORIVSÓRIO)
        ]

const Env = {
    BackBase: env == "production" ? "http://26.219.172.71:3000" : "http://localhost:3000", // ALTERAR PARA NOVO DOMINIO EM PRODUÇÃO
    FrontBase: env == "production" ? "http://26.219.172.71:8000" : "http://localhost:8000", // ALTERAR PARA NOVO DOMINIO EM PRODUÇÃO
    JWT_key: "cui_code_systems_jwt_key_2223",
    Allowed_origins: allowed_origins,
    SystemKey: "6f83517d7035894c05c13ee3a48fd746", // cui_code_systems_admin_key
    PostManTestingException: env != "production"
}

export default Env