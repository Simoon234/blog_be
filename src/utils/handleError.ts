import {HttpException} from "@nestjs/common";

export const handleError = (text: string, status: number) => {
    throw new HttpException(text, status);
}