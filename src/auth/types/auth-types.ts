export interface LoginTK {
    id: string;
    email: string;
}

export interface LogUserReq {
    email: string
    password: string
}

export enum Role {
    ADMIN= 'Admin',
    USER = 'User'
}