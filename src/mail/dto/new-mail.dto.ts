import {IsDefined, IsString} from "class-validator";

export interface Mail {
    subject: string;
    to: string;
    html: string;
}

export class MailDto implements Mail {
    @IsDefined()
    @IsString()
    to: string;

    @IsDefined()
    @IsString()
    subject: string;

    @IsDefined()
    @IsString()
    html: string
}