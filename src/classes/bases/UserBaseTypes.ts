import { Client } from "pg"

type GetUserModuleReferenceRegistries = {
    userId : number
    db : Client
}

type GetUserCreatorModuleReferenceRegistries = GetUserModuleReferenceRegistries & {
    includeDeleted? : boolean
    includeInactive? : boolean
}

export type {
    GetUserModuleReferenceRegistries,
    GetUserCreatorModuleReferenceRegistries
}