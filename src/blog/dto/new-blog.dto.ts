import {NewBlogDtoInterface} from "../types";
import {IsDefined, IsString} from "class-validator";

export class NewBlogDto implements NewBlogDtoInterface{
    @IsString()
    @IsDefined()
    title: string;

    @IsString()
    @IsDefined()
    description: string;

    @IsString()
    @IsDefined()
    photo: string;

    @IsString()
    @IsDefined()
    category: string;
}