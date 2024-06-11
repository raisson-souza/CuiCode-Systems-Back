import User from "../../classes/entities/user/User"

type UserUpdateValidatorProps = {
    dbUser : User,
    newUser : User,
    userAuth : User,
    sameUserOperation : boolean,
}

export type {
    UserUpdateValidatorProps,
}