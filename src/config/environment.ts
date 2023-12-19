let env = "testing"

const Env = {
    Base: env == "production" ? "http://26.219.172.71:3000" : "http://localhost:3000",
    Front_URL: env == "production" ? "http://26.219.172.71:8000" : "http://localhost:8000"
}

export default Env