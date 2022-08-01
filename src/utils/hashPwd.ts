import {hash} from "bcrypt";

export const hashPassword = (password: string): Promise<string> => {
    return hash(password, 12);
}