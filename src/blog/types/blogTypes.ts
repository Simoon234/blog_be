export interface BlogEntityInterface {
    id: string;
    title: string;
    description: string;
    photo: string;
    createdAt: string;
    category: string;
}

export type NewBlogDtoInterface = Omit<BlogEntityInterface, 'id' |'createdAt'>


export enum Deleted {
    DELETED = 'Successfully deleted',
}

export interface DeletedBlogInterface {
    id: string;
    message: Deleted;
    success: boolean;
}

export interface UpdatedBlogInterface {
    id: string;
    success: boolean;
}

