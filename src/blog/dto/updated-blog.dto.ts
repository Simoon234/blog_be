import {IsDefined, IsString} from "class-validator";

export class UpdatedBlogDto {
    @IsString()
    @IsDefined()
    title: string;

    @IsString()
    @IsDefined()
    description: string;

    @IsString()
    @IsDefined()
    photo: string;
}