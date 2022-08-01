export interface UserInterface {
    name: string;
    authorNickName: string;
    email: string;
    password: string;
    avatarUrl: string;
}

export interface NewUserCreatedInterface {
    id: string;
    email: string;
    authorNickName: string;
}

export interface DeletedUserResponse {
    id: string;
    success: boolean;
}

export interface UpdateUserInterface {
    email: string;
    avatarUrl: string;
    password: string;
    authorNickName: string;
}

export type UpdateUserType = {
    message: string;
}


export interface ObjUserInterface {
    id: string;
    name: string;
    email: string;
    authorNickName: string;
    avatarUrl: string;
    details: string;
    gender?: string;
}