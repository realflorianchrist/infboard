export type User = {
    id?: string;
    username: string;
    email: string;
}

export type AuthUser = {
    username?: string;
    email?: string;
    password: string;
}