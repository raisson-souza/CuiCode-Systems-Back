let env = "testing"

const Env = {
    Base: env == "production" ? "http://26.219.172.71:3000" : "http://localhost:3000",
    Front_URL: env == "production" ? "http://26.219.172.71:8000" : "http://localhost:8000",
    JWT_key: "cui_code_systems_jwt_key_2223",
    allowed_origins: env == "production"
        ?
            [
                "http://26.219.172.71:3000/",
                "http://26.219.172.71:3000"
            ]
        :
            [
            "http://localhost:3000/",
            "http://localhost:3000",
            "http://127.0.0.1:5000/",
            "http://127.0.0.1:5000"
            ],
    SystemUserKey: "6f83517d7035894c05c13ee3a48fd746", // cui_code_systems_admin_key
}

export default Env