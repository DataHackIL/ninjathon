export interface Team {
    id?: number
    name: String
    description: String
}
export interface Team_Challenges {
    id?: number
    teamId: number // FK
    challengeId: number // FK
}
export interface Team_Members {
    id?: number
    teamId: number // FK
    user: User // FK
    userId: number
}
export interface Challenge {
    id?: number
    description: String
    createdByUserId: number // FK, Defines whether it's a team project (created by a user of the project) or sponsered challenge (created by a "user" of the sponser)
}

export interface User {
    id: Number
    email: String
    password: String
    role: String
}