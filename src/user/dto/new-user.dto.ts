import {IsDefined, IsNotEmpty, IsString, MinLength} from "class-validator";

export class NewUserDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    authorNickName: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsDefined()
    gender: string
}