import { IsEmail, IsNumber, IsNumberString, IsString } from "class-validator";

export class CreateCsvDto {
    @IsNumberString()
    id?: number;
    @IsNumberString()
    postId: number;
    name: string;
    @IsEmail()
    email: string;
    @IsString()
    body: string;
}
