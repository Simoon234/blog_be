import {IsString} from "class-validator";
import {UpdateUserInterface} from "../types";

export class UpdateUser implements UpdateUserInterface {
    @IsString()
    email: string;

    @IsString()
    avatarUrl: string;

    @IsString()
    password: string;

    @IsString()
    authorNickName: string;
}